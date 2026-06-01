import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);
router.get("/:shortCode", getAnalytics);

export default router;
