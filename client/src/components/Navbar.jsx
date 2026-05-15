import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav id="navbar">
      <Link id="nav-logo" to="/">
        Poll<span>App</span>
      </Link>

      <div id="nav-links">
        <Link className="nav-link" to="/">Home</Link>

        {token ? (
          <>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/admin">Admin</Link>
            <Link id="nav-create-btn" to="/create">Create Poll</Link>
            <button id="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;