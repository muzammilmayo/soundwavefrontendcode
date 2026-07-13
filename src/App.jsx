import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAuth } from "./features/auth/authSlice";

import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Common Pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/resetPassword";
import Profile from "./pages/profile";
import Home from "./pages/home";

// Single Login and Register Selector
import Login from "./pages/login";
import Register from "./pages/register";

// Listener (User) Register & Dashboard
import ListenerRegister from "./pages/Listener/register";
import ListenerDashboard from "./pages/Listener/listener";

// Artist Register, Dashboard & Profile
import ArtistRegister from "./pages/Artist/register";
import ArtistDashboard from "./pages/Artist/Artist";
import ArtistProfile from "./pages/Artist/profile";

// Admin
import AdminDashboard from "./pages/Admin/Admin";

// Super Admin
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdmin";
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins";

// Moderator
import ModeratorDashboard from "./pages/Moderator/Moderator";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Re-validate persisted session with the server in the background.
    // If the token is expired the slice will clear Redux auth state and redirect.
    dispatch(refreshAuth());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Single Login and Register Selector */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Specific Role Registration Forms */}
        <Route path="/listener/register" element={<ListenerRegister />} />
        <Route path="/artist/register" element={<ArtistRegister />} />

        <Route path="/home" element={<Home />} />

        {/* Dashboards protected by ProtectedRoute */}
        <Route
          path="/listener/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Listener"]}>
              <ListenerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/artist/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Artist"]}>
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/artist/profile"
          element={
            <ProtectedRoute allowedRoles={["Artist"]}>
              <ArtistProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SuperAdmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Super Admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SuperAdmin/admins"
          element={
            <ProtectedRoute allowedRoles={["Super Admin"]}>
              <ManageAdmins />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Moderator/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Moderator"]}>
              <ModeratorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Forgot / Reset Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;