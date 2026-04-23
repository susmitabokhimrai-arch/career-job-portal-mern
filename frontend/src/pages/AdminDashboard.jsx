import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/shared/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users:        { count: 0, trend: 0, history: [] },
    jobs:         { count: 0, trend: 0, history: [] },
    applications: { count: 0, trend: 0, history: [] },
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/admin/stats', {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (error) {
      console.log("❌ Error fetching analytics:", error);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/admin/activity', {
        withCredentials: true,
      });
      setActivity(res.data.activity || []);
    } catch (error) {
      console.log("❌ Error fetching activity:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchAnalytics(), fetchActivity()]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "600", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Overview of CareerYatra</p>
          </div>
          <span style={{
            fontSize: "12px", background: "#dcfce7", color: "#16a34a",
            padding: "4px 12px", borderRadius: "999px", fontWeight: "500"
          }}>● Live</span>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            label="Total Users"
            value={stats.users.count}
            trend={stats.users.trend}
            history={stats.users.history}
            iconBg="#EEEDFE" iconColor="#534AB7"
            barLight="#AFA9EC" barDark="#534AB7"
            icon="👤"
          />
          <StatCard
            label="Active Jobs"
            value={stats.jobs.count}
            trend={stats.jobs.trend}
            history={stats.jobs.history}
            iconBg="#FAEEDA" iconColor="#BA7517"
            barLight="#FAC775" barDark="#BA7517"
            icon="💼"
          />
          <StatCard
            label="Applications"
            value={stats.applications.count}
            trend={stats.applications.trend}
            history={stats.applications.history}
            iconBg="#E1F5EE" iconColor="#0F6E56"
            barLight="#9FE1CB" barDark="#0F6E56"
            icon="📄"
          />
        </div>

        {/* Recent Activity */}
        <div>
          <p style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "10px" }}>
            Recent activity
          </p>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            {loading ? (
              <p style={{ padding: "16px", color: "#888", fontSize: "13px" }}>Loading...</p>
            ) : activity.length === 0 ? (
              <p style={{ padding: "16px", color: "#888", fontSize: "13px" }}>No recent activity.</p>
            ) : (
              activity.map((item, i) => (
                <ActivityRow key={i} item={item} isLast={i === activity.length - 1} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Stat Card ────────────────────────────────────────
const StatCard = ({ label, value, trend, history, iconBg, iconColor, barLight, barDark, icon }) => {
  const isUp = trend >= 0;
  return (
    <div style={{
      background: "#fff", borderRadius: "12px",
      border: "1px solid #e5e7eb", padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: iconBg, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "16px", marginBottom: "12px"
      }}>
        {icon}
      </div>
      <p style={{ fontSize: "11px", fontWeight: "500", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: "600", color: "#111", margin: "6px 0" }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: isUp ? "#16a34a" : "#dc2626", margin: 0 }}>
        {isUp ? "↑" : "↓"} {Math.abs(trend)}% from last month
      </p>
      <SparkBar data={history} barLight={barLight} barDark={barDark} />
    </div>
  );
};

// ── Spark Bar ────────────────────────────────────────
const SparkBar = ({ data, barLight, barDark }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "28px", marginTop: "10px" }}>
      {data.map((val, i) => (
        <div key={i} style={{
          width: "6px", borderRadius: "2px",
          height: `${(val / max) * 100}%`, minHeight: "3px",
          background: i === data.length - 1 ? barDark : barLight,
        }} />
      ))}
    </div>
  );
};

// ── Activity Row ─────────────────────────────────────
const pillColors = {
  user:        { bg: "#E6F1FB", color: "#185FA5" },
  job:         { bg: "#FAEEDA", color: "#854F0B" },
  application: { bg: "#E1F5EE", color: "#0F6E56" },
};

const ActivityRow = ({ item, isLast }) => {
  const pill = pillColors[item.type] || pillColors.user;
  const initials = item.name
    ? item.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 20px",
      borderBottom: isLast ? "none" : "1px solid #f3f4f6",
    }}>
      <div style={{
        width: "30px", height: "30px", borderRadius: "50%",
        background: pill.bg, color: pill.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", fontWeight: "500", flexShrink: 0,
      }}>
        {initials}
      </div>
      <p style={{ flex: 1, fontSize: "13px", color: "#111", margin: 0 }}>
        {item.message}
      </p>
      <span style={{
        fontSize: "11px", padding: "2px 8px", borderRadius: "999px",
        fontWeight: "500", background: pill.bg, color: pill.color,
      }}>
        {item.label}
      </span>
      <span style={{ fontSize: "11px", color: "#aaa" }}>{item.time}</span>
    </div>
  );
};

export default AdminDashboard;