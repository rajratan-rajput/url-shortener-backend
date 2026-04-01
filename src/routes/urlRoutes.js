import express from "express";
import { shortenUrl, redirectUrl } from "../controllers/urlController.js";

const router = express.Router();

// create short URL
router.post("/shorten", shortenUrl);

// redirect to original URL
router.get("/:shortCode", redirectUrl);

export default router;