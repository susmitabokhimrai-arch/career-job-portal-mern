
console.log("✅ analytics.routes.js LOADED");
import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/admin/analytics", getAnalytics);

export default router;