import mongoose from "mongoose";
import { client } from "../config/redis.js";

const checkMongoDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    return false;
  }

  await mongoose.connection.db.admin().ping();
  return true;
};

const checkRedis = async () => {
  if (!client.isOpen) {
    return false;
  }

  const response = await client.ping();
  return response === "PONG";
};

const healthCheck = async (req, res) => {
  let mongodb = false;
  let redis = false;

  try {
    mongodb = await checkMongoDB();
  } catch {
    mongodb = false;
  }

  try {
    redis = await checkRedis();
  } catch {
    redis = false;
  }

  const healthy = mongodb && redis;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "unhealthy",
    mongodb: mongodb ? "up" : "down",
    redis: redis ? "up" : "down",
  });
};

export { healthCheck };
