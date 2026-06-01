import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err) => {
  console.error("Redis error:", err.message);
});

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  if (!client.isOpen) {
    await client.connect();
  }
};

export { client, connectRedis };