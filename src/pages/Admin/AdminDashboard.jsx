import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Alert, Snackbar } from "@mui/material";

import synthTheme from "./theme";
import SidebarNav from "./components/admin/SidebarNav";
import api from "../../api";

// Sub-tabs and components
import DashboardTab from "./components/admin/DashboardTab";
import UsersTab from "./components/admin/UsersTab";
import UserDetailsDialog from "./components/admin/UserDetailsDialog";
import SongsTab from "./components/admin/SongsTab";
import ArtistsTab from "./components/admin/ArtistsTab";
import CategoriesTab from "./components/admin/CategoriesTab";
import ReportsTab from "./components/admin/ReportsTab";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [catalogSongs, setCatalogSongs] = useState([]);
  const [catalogArtists, setCatalogArtists] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users from database");
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogData = async () => {
    try {
      const resSongs = await api.get("/catalog/songs");
      setCatalogSongs(resSongs.data.songs || []);
    } catch (err) {
      console.error(err);
    }
    try {
      const resArtists = await api.get("/catalog/artists");
      setCatalogArtists(resArtists.data.artists || []);
    } catch (err) {
      console.error(err);
    }
    try {
      const resCats = await api.get("/catalog/categories");
      setCatalogCategories(resCats.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCatalogData();
  }, []);

  const handleDeleteSong = async (songId) => {
    if (!window.confirm("Are you sure you want to permanently delete this song from the system?")) return;
    try {
      await api.delete(`/catalog/songs/${songId}`);
      showToast("Song deleted successfully", "success");
      setCatalogSongs((prev) => prev.filter((s) => s.song_id !== songId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete song", "error");
    }
  };

  const handleDeleteArtistProfile = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this artist profile?")) return;
    try {
      await api.delete(`/artist-profile/${userId}`);
      showToast("Artist profile deleted", "success");
      setCatalogArtists((prev) => prev.filter((a) => a.user_id !== userId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete artist profile", "error");
    }
  };

  const toggleArtistVerification = async (userId) => {
    try {
      const res = await api.put(`/admin/artists/${userId}/verify`);
      showToast(res.data.message, "success");
      setCatalogArtists((prev) =>
        prev.map((a) => (a.user_id === userId ? { ...a, is_verified: res.data.is_verified } : a))
      );
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update artist verification status", "error");
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      showToast(res.data.message, "success");
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.user_id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser && selectedUser.user_id === userId) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update user status";
      showToast(msg, "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role_name === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsersCount = users.length;
  const artistsCount = users.filter((u) => u.role_name === "Artist").length;
  const listenersCount = users.filter((u) => u.role_name === "Listener").length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const inactiveUsersCount = users.filter((u) => u.status === "Inactive").length;

  const selectStyles = {
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(162, 160, 213, 0.2)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#01F2EA" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#01F2EA" },
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        
        {/* Sidebar Left Navigation */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)" }}>
          <SidebarNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </Box>

        {/* Main Content Workspace Content Space */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Manage users, update statuses, and monitor system parameters.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </Alert>
          )}

          {/* Tab Routing */}
          {currentTab === "dashboard" && (
            <DashboardTab
              totalUsersCount={totalUsersCount}
              artistsCount={artistsCount}
              listenersCount={listenersCount}
              activeUsersCount={activeUsersCount}
              inactiveUsersCount={inactiveUsersCount}
              loading={loading}
              users={users}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === "users" && (
            <UsersTab
              search={search}
              setSearch={setSearch}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filteredUsers={filteredUsers}
              loading={loading}
              setSelectedUser={setSelectedUser}
              toggleUserStatus={toggleUserStatus}
              selectStyles={selectStyles}
            />
          )}

          {currentTab === "songs" && (
            <SongsTab
              catalogSongs={catalogSongs}
              handleDeleteSong={handleDeleteSong}
            />
          )}

          {currentTab === "artists" && (
            <ArtistsTab
              catalogArtists={catalogArtists}
              toggleArtistVerification={toggleArtistVerification}
              handleDeleteArtistProfile={handleDeleteArtistProfile}
            />
          )}

          {currentTab === "categories" && (
            <CategoriesTab
              catalogCategories={catalogCategories}
              setCatalogCategories={setCatalogCategories}
              fetchCatalogData={fetchCatalogData}
              showToast={showToast}
            />
          )}

          {currentTab === "reports" && (
            <ReportsTab
              catalogSongs={catalogSongs}
              catalogArtists={catalogArtists}
              catalogCategories={catalogCategories}
            />
          )}
        </Box>
      </Box>

      {/* User Details Modal Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={toggleUserStatus}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
