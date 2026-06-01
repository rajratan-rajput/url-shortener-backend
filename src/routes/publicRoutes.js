import express from "express";
import { redirectUrl } from "../controllers/urlController.js";

const router = express.Router();

router.get("/:shortCode", redirectUrl);

export default router;
