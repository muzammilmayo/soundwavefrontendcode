import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import authService from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.forgotPassword(email);
      alert(res.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>

        <p>Enter your registered email address.</p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
