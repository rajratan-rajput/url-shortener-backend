import rateLimit from "express-rate-limit";

const shouldSkipRateLimit = (req) =>
  req.path === "/health" ||
  req.path === "/api-docs.json" ||
  req.path.startsWith("/api-docs");

const parseLimit = (envKey, fallback) => {
  const value = Number.parseInt(process.env[envKey] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseLimit("RATE_LIMIT_MAX", 100),
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => shouldSkipRateLimit(req) || req.path === "/shorten",
});

const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseLimit("SHORTEN_RATE_LIMIT_MAX", 30),
  message: {
    message: "Too many shorten requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { apiLimiter, shortenLimiter };
