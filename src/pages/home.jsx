import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import "./home.css";

export default function Home() {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.changePassword(password);
      alert(res.message);

      setPassword({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <div className="home">

      {/* Navbar */}
      

      {/* Hero */}
      <div className="hero">
        <h1>Welcome to SoundWave</h1>
        <p>Enjoy your favourite music anytime, anywhere.</p>
      </div>

      {/* Content */}
      <div className="content">
        <div className="change-password">

          <h2>🔒 Change Password</h2>

          <form onSubmit={changePassword}>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={password.currentPassword}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={password.newPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Update Password
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}