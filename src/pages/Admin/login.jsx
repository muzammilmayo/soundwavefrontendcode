import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

export default function AdminLogin() {
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
      const result = await dispatch(loginUser(user)).unwrap();
      if (result.user.role !== "Admin") {
        alert("Access Denied: You do not have the Admin role.");
        dispatch(logoutUser());
        return;
      }
      alert("Admin Login Successfully");
      navigate("/Admin/dashboard");
    } catch (err) {
      alert(err?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="logo">🛡️ Admin</h1>

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

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-text">
          Don't have an account?
          <Link to="/admin/register"> Register</Link>
        </p>

      </div>
    </div>
  );
}