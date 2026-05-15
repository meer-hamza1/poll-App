import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
    paddingBottom: "1.2rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  badge: {
    fontSize: "13px",
    fontWeight: "600",
    background: "rgba(56,189,248,0.12)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.2)",
    padding: "8px 14px",
    borderRadius: "14px",
    backdropFilter: "blur(10px)",
  },

  dashboard: {
    padding: "2rem",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.1), transparent 28%), radial-gradient(circle at bottom right, rgba(139,92,246,0.1), transparent 30%), linear-gradient(135deg, #020617 0%, #050816 45%, #0f172a 100%)",
  },

  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "0.5px",
  },

  searchWrapper: {
    margin: "0 0 2rem 0",
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
    color: "#64748b",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "15px 16px 15px 42px",
    fontSize: "15px",
    color: "#f8fafc",
    background: "rgba(17,24,39,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    boxSizing: "border-box",
    outline: "none",
    backdropFilter: "blur(14px)",
    transition: "all 0.25s ease",
  },

  noResults: {
    fontSize: "15px",
    color: "#64748b",
    textAlign: "center",
    padding: "2rem 0",
    gridColumn: "1 / -1",
    fontWeight: "500",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "rgba(17,24,39,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "1.6rem",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    cursor: "pointer",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: "all 0.3s ease",
  },

  cardIconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(139,92,246,0.18))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.12)",
    boxShadow: "0 0 18px rgba(56,189,248,0.08)",
  },

  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
    lineHeight: 1.5,
  },

  cardMeta: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },

  openBtn: {
    marginTop: "auto",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#38bdf8",
    background: "rgba(14,165,233,0.08)",
    border: "1px solid rgba(56,189,248,0.16)",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  createCard: {
    background: "rgba(17,24,39,0.72)",
    border: "1px dashed rgba(56,189,248,0.28)",
    borderRadius: "28px",
    padding: "1.6rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    cursor: "pointer",
    minHeight: "220px",
    backdropFilter: "blur(18px)",
    transition: "all 0.3s ease",
  },

  createPlusCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(139,92,246,0.18))",
    border: "1px solid rgba(56,189,248,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    color: "#38bdf8",
    lineHeight: 1,
    transition: "all 0.25s ease",
    boxShadow: "0 0 22px rgba(56,189,248,0.1)",
  },

  createLabel: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#38bdf8",
    margin: 0,
  },
};

function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new
  const [createHovered, setCreateHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/polls`,
        authHeader(),
      );
      setPolls(response.data.polls);
    };
    fetchPolls();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/polls/${pollId}`,
        authHeader(),
      );
      setPolls(polls.filter((poll) => poll._id !== pollId));
    } catch (error) {
      console.log(error);
    }
  };

  // filter polls by search query
  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.heading}>All polls</h1>
        <div style={styles.headerRight}>
          <span style={styles.badge}>{polls.length} polls</span>
        </div>
      </div>

      {/* ✅ search bar */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search polls..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
          onBlur={(e) => (e.target.style.borderColor = "#1e2130")}
        />
      </div>

      <div style={styles.grid}>
        {/* ✅ no results message */}
        {filteredPolls.length === 0 && searchQuery && (
          <p style={styles.noResults}>No polls found for "{searchQuery}"</p>
        )}

        {filteredPolls.map((poll) => (
          <div
            key={poll._id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e2130";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.cardIconBox}>📋</div>
            <p style={styles.cardTitle}>{poll.title}</p>
            <p style={styles.cardMeta}>
              {poll.questions.length} question
              {poll.questions.length !== 1 ? "s" : ""}
            </p>
            <button
              style={styles.openBtn}
              onClick={() => navigate(`/poll/${poll._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #0ea5e9, #8b5cf6)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(14,165,233,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                e.currentTarget.style.color = "#38bdf8";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Open poll →
            </button>

            <button
              style={styles.openBtn}
              onClick={() => navigate(`/analytics/${poll._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #0ea5e9, #8b5cf6)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(14,165,233,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                e.currentTarget.style.color = "#38bdf8";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Analytics
            </button>
            <button
              style={styles.openBtn}
              className="delete-btn"
              onClick={() => handleDeletePoll(poll._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #ef4444, #dc2626)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                e.currentTarget.style.color = "#38bdf8";
              }}
            >
              Delete
            </button>
            <button
              style={styles.openBtn}
              className="edit-btn"
              onClick={() => navigate(`/edit/${poll._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #0ea5e9, #8b5cf6)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(14,165,233,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                e.currentTarget.style.color = "#38bdf8";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Edit
            </button>
          </div>
        ))}

        {/* Create Poll card — always visible */}
        <div
          style={{
            ...styles.createCard,
            ...(createHovered && {
              borderColor: "#38bdf8",
              backgroundColor: "#0d2a3b",
              transform: "translateY(-2px)",
            }),
          }}
          onClick={() => navigate("/create")}
          onMouseEnter={() => setCreateHovered(true)}
          onMouseLeave={() => setCreateHovered(false)}
        >
          <div
            style={{
              ...styles.createPlusCircle,
              ...(createHovered && {
                background: "#38bdf8",
                color: "#0d2a3b",
              }),
            }}
          >
            +
          </div>
          <p style={styles.createLabel}>Create poll</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
