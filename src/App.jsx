import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAuth } from "./features/auth/authSlice";

import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Common Pages
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/resetPassword";
import Profile from "./components/profile";
import Home from "./components/home";

// Single Login and Register Selector
import Login from "./components/login";
import Register from "./components/register";

// Listener (User) Register & Dashboard
import ListenerRegister from "./components/Listener/register";
import ListenerDashboard from "./components/Listener/listener";

// Artist Register, Dashboard & Profile
import ArtistRegister from "./components/Artist/register";
import ArtistDashboard from "./components/Artist/Artist";
import ArtistProfile from "./components/Artist/profile";
import DraftSongs from "./components/Artist/DraftSongs";


// Admin
import AdminDashboard from "./components/Admin/AdminDashboard";

// Super Admin
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdmin";
import ManageAdmins from "./components/SuperAdmin/ManageAdmins";


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
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
        <Route path="/listener/dashboard" element={<ProtectedRoute allowedRoles={["Listener"]}><ListenerDashboard /></ProtectedRoute>} />

          <Route
            path="/artist/dashboard"
            element={<ProtectedRoute allowedRoles={["Artist", "Moderator"]}><ArtistDashboard /></ProtectedRoute>}
          />
          <Route
            path="/artist/drafts"
            element={<ProtectedRoute allowedRoles={["Artist"]}><DraftSongs /></ProtectedRoute>}
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