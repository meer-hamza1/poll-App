import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div id="register-page">
      <form id="register-card" onSubmit={handleRegister}>

        <div id="register-header">
          <div id="register-icon">✦</div>
          <h1 id="register-title">Create account</h1>
          <p id="register-subtitle">Join PollApp and start creating polls.</p>
        </div>

        <hr id="register-divider" />

        <div className="reg-field" id="name-field">
          <label className="reg-label" htmlFor="name-input">Full name</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">👤</span>
            <input
              id="name-input"
              className="reg-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="reg-field" id="email-field">
          <label className="reg-label" htmlFor="email-input">Email</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">✉</span>
            <input
              id="email-input"
              className="reg-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="reg-field" id="password-field">
          <label className="reg-label" htmlFor="password-input">Password</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">🔒</span>
            <input
              id="password-input"
              className="reg-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button id="register-btn" type="submit">Create account →</button>

        <p id="register-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </form>
    </div>
  );
}

export default Register;