const REQUIRED_IN_PRODUCTION = [
  "MONGO_URI",
  "REDIS_URL",
  "BASE_URL",
  "JWT_SECRET",
  "CORS_ORIGIN",
];

export function getBaseUrl() {
  const baseUrl = process.env.BASE_URL?.trim().replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") {
    if (!baseUrl) {
      throw new Error("BASE_URL is required in production");
    }
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      throw new Error("BASE_URL must start with http:// or https://");
    }
    return baseUrl;
  }

  return baseUrl || "http://localhost:5000";
}

export function validateEnv() {
  if (process.env.NODE_ENV === "test") {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
    if (!process.env.BASE_URL) {
      process.env.BASE_URL = "http://localhost:5000";
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    process.env.JWT_SECRET =
      process.env.JWT_SECRET || "dev-jwt-secret-change-in-production";
    return;
  }

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  getBaseUrl();

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  if (!process.env.CORS_ORIGIN?.trim()) {
    throw new Error("CORS_ORIGIN must list your frontend URL(s) in production");
  }
}
