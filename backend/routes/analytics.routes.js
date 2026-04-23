console.log("✅ analytics.routes.js LOADED");
import express from "express";
import { getAnalytics, getStats, getActivity } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/analytics", getAnalytics);  // existing
router.get("/stats",     getStats);      // trends + history
router.get("/activity",  getActivity);   // recent activity feed

export default router;