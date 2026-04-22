import {User} from '../models/user.model.js';
import {Job } from '../models/job.model.js';
import { Application} from '../models/application.model.js';

// ── helper ──────────────────────────────────────────
const calcTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100.0 : 0.0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};

// ── sparkbar history helper ──────────────────────────
const getHistory = async (Model) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const result = await Model.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $project: { _id: 0, count: 1 } },
  ]);

  return result.map(r => r.count);
};

// ── main controller ──────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

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

    res.json({
      users: {
        count: totalUsers,
        trend: calcTrend(usersThis, usersLast),
        history: userHistory,
      },
      jobs: {
        count: totalJobs,
        trend: calcTrend(jobsThis, jobsLast),
        history: jobHistory,
      },
      applications: {
        count: totalApps,
        trend: calcTrend(appsThis, appsLast),
        history: appHistory,
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};