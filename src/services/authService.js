import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { client } from "../config/redis.js";

const SALT_ROUNDS = 12;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const getTokenExpiry = () => process.env.JWT_EXPIRES_IN || "7d";

export const signToken = (userId) =>
  jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: getTokenExpiry() });

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = signToken(user._id.toString());
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  user.password = undefined;
  const token = signToken(user._id.toString());
  return { user, token };
};

export const logoutUser = async (token) => {
  if (!token) return;

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const ttlSeconds = Math.max(
      1,
      Math.floor((decoded.exp * 1000 - Date.now()) / 1000)
    );
    await client.set(`bl:${token}`, "1", { EX: ttlSeconds });
  } catch {
    // Invalid or expired token — nothing to blacklist
  }
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
