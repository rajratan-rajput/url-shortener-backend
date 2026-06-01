import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { client, connectRedis } from "./config/redis.js";
import { buildApp } from "./app.js";
import { validateEnv } from "./config/env.js";
import { logger } from "./utils/logger.js";

dotenv.config();
validateEnv();

const PORT = process.env.PORT || 5000;

const shutdown = async (signal, server) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      if (client.isOpen) {
        await client.quit();
      }
      logger.info("Shutdown complete.");
      process.exit(0);
    } catch (error) {
      logger.error("Shutdown error", { error: error.message });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

const start = async () => {
  await connectDB();
  await connectRedis();

  const app = buildApp();
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      env: process.env.NODE_ENV || "development",
    });
  });

  process.on("SIGTERM", () => shutdown("SIGTERM", server));
  process.on("SIGINT", () => shutdown("SIGINT", server));
};

start().catch((error) => {
  logger.error("Failed to start server", { error: error.message });
  process.exit(1);
});
