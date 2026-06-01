import express from "express";
import { getStats } from "../controllers/dashboardController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);
router.get("/stats", getStats);

export default router;
