import express from "express";
import { healthCheck } from "./controllers/healthController.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { setupSwagger } from "./config/swagger.js";
import { applySecurityMiddleware } from "./middlewares/security.js";
import { applyCors } from "./middlewares/cors.js";
import authRoutes from "./routes/authRoutes.js";
import apiUrlRoutes from "./routes/apiUrlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

export function buildApp() {
  const app = express();

  if (process.env.TRUST_PROXY === "production") {
    app.set("trust proxy", 1);
  }

  applyCors(app);
  applySecurityMiddleware(app);

  if (process.env.NODE_ENV !== "test") {
    app.use(apiLimiter);
  }

  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "32kb" }));

  app.use("/qr", qrRoutes);

  if (process.env.ENABLE_SWAGGER === "true") {
    setupSwagger(app);
  }

  app.get("/health", healthCheck);

  app.use("/api/auth", authRoutes);
  app.use("/api/url", apiUrlRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use("/", publicRoutes);

  app.use(errorHandler);

  return app;
}
