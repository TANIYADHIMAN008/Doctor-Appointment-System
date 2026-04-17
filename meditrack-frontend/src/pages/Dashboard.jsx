import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import { useAuth } from "../context/AuthContext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();
  const { token, role, user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (role && role !== "doctor") {
      navigate("/login", { replace: true });
      return;
    }

    fetchStats();

  }, [authLoading, token, role, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8001/appointments/doctor`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      const appts = Array.isArray(data) ? data : [];

      // 🔥 FIXED STATUS (CASE SAFE)
      setStats({
        total: appts.length,
        accepted: appts.filter(a => a.status?.toLowerCase() === "accepted").length,
        pending: appts.filter(a => a.status?.toLowerCase() === "pending").length,
        rejected: appts.filter(a => a.status?.toLowerCase() === "rejected").length
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Loading...</p>;

  const pieData = [
    { name: "Accepted", value: stats.accepted },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected }
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="dashboard-container">

      <SidebarDoctor />

      <div className="main-content">

        <div className="topbar">
          <h1>👨‍⚕️ Doctor Dashboard</h1>
          <p>Welcome, {user?.name || "Doctor"}</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">

              <div className="stat-card total">
                <h3>📊 Total</h3>
                <h1>{stats.total}</h1>
              </div>

              <div className="stat-card accepted">
                <h3>✅ Accepted</h3>
                <h1>{stats.accepted}</h1>
              </div>

              <div className="stat-card pending">
                <h3>⏳ Pending</h3>
                <h1>{stats.pending}</h1>
              </div>

              <div className="stat-card rejected">
                <h3>❌ Rejected</h3>
                <h1>{stats.rejected}</h1>
              </div>

            </div>

            <div className="chart-box">
              <PieChart width={450} height={350}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={60}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;