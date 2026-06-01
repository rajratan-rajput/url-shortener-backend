import { client } from "../config/redis.js";
import User from "../models/userModel.js";
import { verifyToken } from "../services/authService.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      res.status(401);
      throw new Error("Authentication required");
    }

    const blacklisted = await client.get(`bl:${token}`);
    if (blacklisted) {
      res.status(401);
      throw new Error("Token has been revoked");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      res.status(401);
      return next(new Error("Invalid or expired token"));
    }
    next(error);
  }
};
