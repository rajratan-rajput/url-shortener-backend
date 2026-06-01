import express from "express";
import {
  createUrl,
  getMyUrls,
  deleteUrl,
} from "../controllers/urlController.js";
import { authenticate } from "../middlewares/auth.js";
import { shortenLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.use(authenticate);

if (process.env.NODE_ENV === "test") {
  router.post("/create", createUrl);
} else {
  router.post("/create", shortenLimiter, createUrl);
}

router.get("/my-urls", getMyUrls);
router.delete("/:id", deleteUrl);

export default router;
