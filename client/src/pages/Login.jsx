import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/google",
        { token: credentialResponse.credential }
      );
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Google Sign-In failed");
    }
  };

  return (
    <div id="login-page">
      <form id="login-card" onSubmit={handleLogin}>
        <h1 id="login-title">Welcome back</h1>
        <p id="login-subtitle">Sign in to your account to continue.</p>
        <hr id="login-divider" />

        <div className="login-field" id="email-field">
          <label className="login-label" htmlFor="email-input">Email</label>
          <input
            id="email-input"
            className="login-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field" id="password-field">
          <label className="login-label" htmlFor="password-input">Password</label>
          <input
            id="password-input"
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button id="login-btn" type="submit">Login</button>

        <div id="login-divider-or">
          <hr className="or-line" />
          <span className="or-text">or</span>
          <hr className="or-line" />
        </div>

        <div id="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Sign-In failed")}
            width="100%"
          />
        </div>

        <p id="register-footer">
          New to POllApp? <Link to="/Register">Sign up now</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;