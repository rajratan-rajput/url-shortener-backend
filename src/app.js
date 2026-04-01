import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import urlRoutes from "./routes/urlRoutes.js";
import limiter from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
connectDB();
connectRedis();

const app = express();
app.use(limiter);

// middleware to parse JSON
app.use(express.json());
app.use("/", urlRoutes);
app.use(errorHandler);


// test route
app.get("/", (req, res) => {
  res.send("URL Shortener API is running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});