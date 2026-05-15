import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/stats");
        setStats(res.data.stats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div id="admin-page">
        <p id="admin-loading">Loading...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Polls", value: stats.totalPolls, icon: "📋" },
    { label: "Total Users", value: stats.totalUsers, icon: "👤" },
    { label: "Total Votes", value: stats.totalVotes, icon: "🗳️" },
    {
      label: "Top Poll",
      value: stats.topPoll ? `${stats.topPoll.votes} votes` : "—",
      icon: "🏆",
      sub: stats.topPoll?.title,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="admin-tooltip">
          <p className="admin-tooltip-val">{payload[0].value} polls</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="admin-page">
      <div id="admin-header">
        <h1 id="admin-title">Admin Dashboard</h1>
        <button id="admin-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </div>

      {/* stat cards */}
      <div id="admin-stats-grid">
        {statCards.map((card, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-info">
              <p className="admin-stat-value">{card.value}</p>
              <p className="admin-stat-label">{card.label}</p>
              {card.sub && (
                <p className="admin-stat-sub" title={card.sub}>
                  {card.sub.length > 24
                    ? card.sub.slice(0, 24) + "…"
                    : card.sub}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* polls per day chart */}
      <div className="admin-section">
        <p className="admin-section-title">Polls created — last 7 days</p>
        <div className="admin-chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={stats.pollsPerDay}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e2130"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#8b8fa8", fontSize: 12 }}
                axisLine={{ stroke: "#1e2130" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#8b8fa8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e2130" }} />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* recent polls */}
      <div className="admin-section">
        <p className="admin-section-title">Recent polls</p>
        <div id="admin-recent-list">
          {stats.recentPolls.length === 0 && (
            <p className="admin-empty">No polls yet.</p>
          )}
          {stats.recentPolls.map((poll, i) => (
            <div className="admin-recent-row" key={i}>
              <div className="admin-recent-left">
                <span className="admin-recent-icon">📋</span>
                <div>
                  <p className="admin-recent-title">{poll.title}</p>
                  <p className="admin-recent-meta">
                    {poll.questions.length} question
                    {poll.questions.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="admin-recent-date">
                {new Date(poll.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;