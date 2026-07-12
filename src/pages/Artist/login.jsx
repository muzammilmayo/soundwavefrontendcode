import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

export default function Artistlogin() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.login(user);
      if (res.user.role !== "Artist") {
        alert("Access Denied: You do not have the Artist role.");
        await authService.logout();
        return;
      }
      alert("Login Successful");
      navigate("/artist/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">🎵</div>

        <h2>Welcome Back</h2>

        <form className="auth-form" onSubmit={login}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-text">
          Don't have an account?{" "}
          <Link to="/artist/register">Register</Link>
        </p>

        <p className="auth-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}