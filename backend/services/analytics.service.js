import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// ── EXISTING ─────────────────────────────────────────
export const getAnalyticsData = async () => {
  const totalUsers        = await User.countDocuments();
  const totalJobs         = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  return { totalUsers, totalJobs, totalApplications };
};

// ── HELPERS ──────────────────────────────────────────
const calcTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100.0 : 0.0;
  const trend = parseFloat((((current - previous) / previous) * 100).toFixed(1));
  return Math.min(trend, 999);
};

const getHistory = async (Model) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const result = await Model.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $project: { _id: 0, count: 1 } },
  ]);
  return result.map(r => r.count);
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)    return `${seconds}s ago`;
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ── DETAILED STATS ────────────────────────────────────
export const getDetailedStats = async () => {
  const now              = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);

  const [usersThis, jobsThis, appsThis] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    Job.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    Application.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
  ]);

  const [usersLast, jobsLast, appsLast] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Job.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Application.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
  ]);

  const [totalUsers, totalJobs, totalApps] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);

  const [userHistory, jobHistory, appHistory] = await Promise.all([
    getHistory(User),
    getHistory(Job),
    getHistory(Application),
  ]);

  return {
    users:        { count: totalUsers, trend: calcTrend(usersThis, usersLast), history: userHistory },
    jobs:         { count: totalJobs,  trend: calcTrend(jobsThis,  jobsLast),  history: jobHistory  },
    applications: { count: totalApps,  trend: calcTrend(appsThis,  appsLast),  history: appHistory  },
  };
};

// ── RECENT ACTIVITY ───────────────────────────────────
export const getRecentActivity = async () => {
  const [recentUsers, recentJobs, recentApps] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(3).select("fullname createdAt"),
    Job.find().sort({ createdAt: -1 }).limit(3).select("title createdAt"),
    Application.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("applicant", "fullname")
      .populate("job", "title"),
  ]);

  const activities = [
    ...recentUsers.map(u => ({
      type:      "user",
      name:      u.fullname,
      message:   `${u.fullname} registered as a new user`,
      label:     "User",
      time:      timeAgo(u.createdAt),
      createdAt: u.createdAt,
    })),
    ...recentJobs.map(j => ({
      type:      "job",
      name:      j.title,
      message:   `New job posted: ${j.title}`,
      label:     "Job",
      time:      timeAgo(j.createdAt),
      createdAt: j.createdAt,
    })),
    ...recentApps.map(a => ({
      type:      "application",
      name:      a.applicant?.fullname || "Someone",
      message:   `${a.applicant?.fullname || "Someone"} applied for ${a.job?.title || "a job"}`,
      label:     "New",
      time:      timeAgo(a.createdAt),
      createdAt: a.createdAt,
    })),
  ];

  return activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};