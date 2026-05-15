import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Results",
      desc: "Watch votes come in live with instant updates powered by WebSockets.",
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      desc: "Beautiful bar charts and progress bars to visualize poll responses.",
    },
    {
      icon: "⏱️",
      title: "Poll Expiry",
      desc: "Set a countdown timer on your polls so voting closes automatically.",
    },
    {
      icon: "🔗",
      title: "Share Instantly",
      desc: "Copy and share your poll link with anyone — no login required to vote.",
    },
    {
      icon: "🔒",
      title: "No Duplicate Votes",
      desc: "Browser-level protection prevents the same person from voting twice.",
    },
    {
      icon: "🛡️",
      title: "Your Polls, Your Data",
      desc: "Each user sees only their own polls. Full ownership and privacy.",
    },
  ];

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-left">
          <span className="badge">Live Polling Platform</span>

          <h1>
            Engage Your Audience
            With Real-Time Polls
          </h1>

          <p>
            Create interactive polls, collect instant responses,
            and visualize analytics live — just like modern
            presentation platforms.
          </p>

          <div className="hero-buttons">
            {token ? (
              // ✅ logged in — show dashboard button instead
              <>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/create")}
                >
                  Create a Poll
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  My Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <button className="primary-btn">Get Started</button>
                </Link>
                <Link to="/login">
                  <button className="secondary-btn">Login</button>
                </Link>
              </>
            )}
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <h2>10K+</h2>
              <p>Poll Responses</p>
            </div>
            <div className="stat-card">
              <h2>500+</h2>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h2>Live</h2>
              <p>Realtime Analytics</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="poll-preview">
            <div className="preview-header">
              <span className="live-dot"></span>
              Live Results
            </div>

            <h3>Which frontend framework do you prefer?</h3>

            <div className="result-item">
              <div className="result-top">
                <span>React</span>
                <span>72%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill react"></div>
              </div>
            </div>

            <div className="result-item">
              <div className="result-top">
                <span>Vue</span>
                <span>18%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill vue"></div>
              </div>
            </div>

            <div className="result-item">
              <div className="result-top">
                <span>Angular</span>
                <span>10%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill angular"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <h2 className="section-title">How it works</h2>
        <p className="section-sub">Three simple steps to get started</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create a Poll</h3>
            <p>Sign up, add your question and options, set an optional expiry time.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Share the Link</h3>
            <p>Copy your poll link and share it with your audience — no login needed to vote.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Watch Live Results</h3>
            <p>See votes come in real-time with live updating charts and analytics.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-sub">Built for speed, simplicity, and real-time engagement</p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="cta-section">
          <h2>Ready to create your first poll?</h2>
          <p>Join hundreds of users already using PollApp to engage their audience.</p>
          <Link to="/register">
            <button className="primary-btn">Get Started Free</button>
          </Link>
        </section>
      )}

    </div>
  );
}

export default Home;