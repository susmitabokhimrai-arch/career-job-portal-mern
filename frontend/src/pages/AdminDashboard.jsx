import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const fetchAnalytics = async () => {
    try {
      console.log("📊 Fetching analytics...");

      const res = await fetch("http://localhost:8000/api/v1/admin/analytics");

      const data = await res.json();

      console.log("📦 Analytics response:", data);

      if (data.success) {
        console.log("✅ Setting stats:", data.data);
        setStats(data.data);
      } else {
        console.log("❌ API returned success:false");
      }

    } catch (error) {
      console.log("❌ Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard 📊</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        {/* USERS */}
        <div style={cardStyle}>
          <h3>👤 Users</h3>
          <p style={numberStyle}>{stats.totalUsers}</p>
        </div>

        {/* JOBS */}
        <div style={cardStyle}>
          <h3>💼 Jobs</h3>
          <p style={numberStyle}>{stats.totalJobs}</p>
        </div>

        {/* APPLICATIONS */}
        <div style={cardStyle}>
          <h3>📄 Applications</h3>
          <p style={numberStyle}>{stats.totalApplications}</p>
        </div>

      </div>
    </div>
  );
};

// simple styles
const cardStyle = {
  flex: 1,
  padding: "20px",
  borderRadius: "10px",
  background: "#f5f5f5",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const numberStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "10px",
};

export default AdminDashboard;