console.log("✅ analytics.routes.js LOADED");
import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// ✅ FIX: use controller instead of hardcoded response
router.get("/analytics", getAnalytics);

export default router;
