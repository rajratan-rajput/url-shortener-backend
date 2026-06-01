import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const redisStore = new Map();

await jest.unstable_mockModule("../src/config/redis.js", () => ({
  client: {
    isOpen: true,
    connect: async () => {},
    get: async (key) => {
      const entry = redisStore.get(key);
      if (!entry) return null;
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        redisStore.delete(key);
        return null;
      }
      return entry.value;
    },
    set: async (key, value, options) => {
      const entry = { value, expiresAt: null };
      if (options?.EX) entry.expiresAt = Date.now() + options.EX * 1000;
      redisStore.set(key, entry);
    },
    del: async (key) => {
      redisStore.delete(key);
    },
    ping: async () => "PONG",
  },
  connectRedis: async () => {},
}));

const { default: connectDB } = await import("../src/config/db.js");
const { buildApp } = await import("../src/app.js");

let mongoServer;
let app;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.BASE_URL = "http://localhost:5000";
  process.env.JWT_SECRET = "test-jwt-secret-key-for-integration-tests";

  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();

  await connectDB();
  app = buildApp();
}, 180000);

afterEach(async () => {
  redisStore.clear();
  if (mongoose.connection.readyState === 1) {
    for (const collection of Object.values(mongoose.connection.collections)) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

const registerUser = () =>
  request(app).post("/api/auth/register").send(testUser);

describe("Authentication & URL API", () => {
  it("registers a new user", async () => {
    const res = await registerUser().expect(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("logs in an existing user", async () => {
    await registerUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });

  it("rejects unauthorized URL creation", async () => {
    const res = await request(app)
      .post("/api/url/create")
      .send({ url: "https://example.com" })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("creates a URL when authenticated", async () => {
    const { body } = await registerUser();
    const res = await request(app)
      .post("/api/url/create")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ url: "https://example.com/page" })
      .expect(201);

    expect(res.body.shortUrl).toMatch(/http:\/\/localhost:5000\//);
    expect(res.body.qrCode).toMatch(/\/qr\/.+\.png$/);
    expect(res.body.clicks).toBe(0);
  });

  it("redirects to the original URL", async () => {
    const { body } = await registerUser();
    const createRes = await request(app)
      .post("/api/url/create")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ url: "https://example.org/target" })
      .expect(201);

    const shortCode = createRes.body.shortCode;

    const redirectRes = await request(app)
      .get(`/${shortCode}`)
      .redirects(0)
      .expect(302);

    expect(redirectRes.headers.location).toBe("https://example.org/target");
  });

  it("retrieves analytics for owned URL", async () => {
    const { body } = await registerUser();
    const createRes = await request(app)
      .post("/api/url/create")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ url: "https://analytics-test.com" })
      .expect(201);

    await request(app).get(`/${createRes.body.shortCode}`).redirects(0);

    const statsRes = await request(app)
      .get(`/api/analytics/${createRes.body.shortCode}`)
      .set("Authorization", `Bearer ${body.token}`)
      .expect(200);

    expect(statsRes.body.totalClicks).toBeGreaterThanOrEqual(1);
    expect(statsRes.body.clicksPerDay).toBeDefined();
    expect(statsRes.body.recentEvents).toBeDefined();
  });

  it("rejects analytics for unauthenticated user", async () => {
    const res = await request(app)
      .get("/api/analytics/somecode")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it("returns dashboard stats", async () => {
    const { body } = await registerUser();
    await request(app)
      .post("/api/url/create")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ url: "https://dashboard-test.com" });

    const res = await request(app)
      .get("/api/dashboard/stats")
      .set("Authorization", `Bearer ${body.token}`)
      .expect(200);

    expect(res.body.totalUrls).toBe(1);
    expect(res.body.totalClicks).toBe(0);
  });

  it("rejects invalid URL", async () => {
    const { body } = await registerUser();
    const res = await request(app)
      .post("/api/url/create")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ url: "javascript:alert(1)" })
      .expect(400);

    expect(res.body.message).toContain("http and https");
  });

  it("returns 404 for unknown short code", async () => {
    const res = await request(app).get("/unknown99").expect(404);
    expect(res.body.message).toBe("URL not found");
  });
});
