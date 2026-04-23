import { getAnalyticsData, getDetailedStats, getRecentActivity } from "../services/analytics.service.js";

// ── EXISTING ─────────────────────────────────────────
export const getAnalytics = async (req, res, next) => {
  try {
    const data = await getAnalyticsData();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── STATS WITH TRENDS ─────────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const data = await getDetailedStats();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// ── RECENT ACTIVITY ───────────────────────────────────
export const getActivity = async (req, res, next) => {
  try {
    const activity = await getRecentActivity();
    return res.status(200).json({ activity });
  } catch (error) {
    next(error);
  }
};