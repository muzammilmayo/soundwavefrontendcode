import { Navigate } from "react-router-dom";
import authService from "../services/authService";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = authService.getUser();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" />;
  }

  return children;
}