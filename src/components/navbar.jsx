import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="nav-logo">
        <Link to="/">🎵 SoundWave</Link>
      </div>

      <div className="nav-links">
        {/* <Link to="/">Home</Link> */}
      </div>
      {/* <Link to="/profile">Profile</Link> */}

      <div className="nav-auth">
        {authService.isLoggedIn() ? (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

    </nav>
  );
}