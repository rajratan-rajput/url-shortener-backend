import express from "express";
import { serveQrCode } from "../controllers/qrController.js";

const router = express.Router();

router.get("/:fileName", serveQrCode);

export default router;
