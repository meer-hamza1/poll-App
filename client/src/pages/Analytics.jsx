import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./Analytics.css";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

const socket = io(`${import.meta.env.VITE_API_URL}`);


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{payload[0].payload.text}</p>
        <p className="tooltip-votes">{payload[0].value} votes</p>
        <p className="tooltip-pct">{payload[0].payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/polls/${id}/analytics`,authHeader()
      );
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    socket.on("voteUpdate", () => {
      console.log("Realtime update received");
      fetchAnalytics();
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, []);

  if (!analytics) {
    return (
      <div id="analytics-loading-container">
        <p id="analytics-loading">Loading...</p>
      </div>
    );
  }

  return (
    <div id="analytics-page">
      <div id="analytics-header">
        <h1 id="analytics-title">Analytics</h1>
        <div id="analytics-header-right">
          <span id="total-responses-badge">
            {analytics.totalResponse} total responses
          </span>


          <div id="chart-toggle">
            <button
              className={`toggle-btn ${chartType === "bar" ? "active" : ""}`}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
            <button
              className={`toggle-btn ${chartType === "progress" ? "active" : ""}`}
              onClick={() => setChartType("progress")}
            >
              Progress
            </button>
          </div>
        </div>
      </div>

      <div id="questions-list">
        {analytics.questions.map((question, questionIndex) => {
          const totalVotes = question.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          const chartData = question.options.map((option) => ({
            text: option.text.length > 12
              ? option.text.slice(0, 12) + "…"
              : option.text,
            fullText: option.text,
            votes: option.votes,
            percentage:
              totalVotes > 0
                ? ((option.votes / totalVotes) * 100).toFixed(1)
                : 0,
          }));

          return (
            <div
              className="analytics-card"
              key={questionIndex}
              id={`question-card-${questionIndex}`}
            >
              <p className="analytics-question">{question.question}</p>

              {/* ✅ bar chart view */}
              {chartType === "bar" ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e2130"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="text"
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
                      <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={index === 0 ? "#38bdf8" : `rgba(56,189,248,${0.85 - index * 0.15 > 0.3 ? 0.85 - index * 0.15 : 0.3})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
          
                question.options.map((option, optionIndex) => {
                  const percentage =
                    totalVotes > 0
                      ? ((option.votes / totalVotes) * 100).toFixed(1)
                      : 0;

                  return (
                    <div
                      className="option-result"
                      key={`${option.text}-${optionIndex}`}
                      id={`option-result-${optionIndex}`}
                    >
                      <div className="option-top">
                        <span className="option-text">{option.text}</span>
                        <span className="option-pct">{percentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="vote-count">{option.votes} votes</p>
                    </div>
                  );
                })
              )}

              {/* ✅ total votes per question */}
              <p className="question-total">{totalVotes} total votes</p>
            </div>
          );
        })}
      </div>

      <button
        id="back-dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Analytics;