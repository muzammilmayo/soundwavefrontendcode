import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReportsTab from "../../components/Moderator/ReportsTab";
import SongsTab from "../../components/Moderator/SongsTab";
import AlbumsTab from "../../components/Moderator/AlbumsTab";
import UsersTab from "../../components/Moderator/UsersTab";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Chip, Snackbar, Alert,
  Tabs, Tab, CircularProgress, Tooltip
} from "@mui/material";
import {
  Flag as FlagIcon, Person as PersonIcon,
  ExitToApp as ExitToAppIcon, CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon, Shield as ShieldIcon,
  MusicNote as MusicNoteIcon, Album as AlbumIcon,
  Group as GroupIcon, Refresh as RefreshIcon
} from "@mui/icons-material";
import authService from "../../services/authService";
import api from "../../api";

// ===== HARDCODED NEON DARK THEME =====
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#01F2EA" }, // Neon Cyan
    secondary: { main: "#CE04F2" }, // Neon Magenta
    background: { default: "#100B29", paper: "#1A153A" }, // Deep Purple Palette
    text: { primary: "#FFFFFF", secondary: "#A2A0D5" }, // White and Soft Lavender
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ModeratorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Reports, 1: Songs, 2: Albums, 3: Users
  const [reports, setReports] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (msg, sev = "success") => setToast({ open: true, message: msg, severity: sev });
  const handleLogout = () => { authService.logout(); navigate("/login"); };

  // Load live data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        const res = await api.get("/moderator/reports");
        setReports(res.data.reports || []);
      } else if (activeTab === 1) {
        const res = await api.get("/moderator/songs");
        setSongs(res.data.songs || []);
      } else if (activeTab === 2) {
        const res = await api.get("/moderator/albums");
        setAlbums(res.data.albums || []);
      } else if (activeTab === 3) {
        const res = await api.get("/moderator/users");
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to load moderation data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Report Resolution Handler
  const handleResolveReport = async (id) => {
    try {
      await api.put(`/moderator/reports/${id}/resolve`);
      showToast("Report resolved and content moderated successfully.", "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to resolve report", "error");
    }
  };

  // Report Dismissal Handler
  const handleDismissReport = async (id) => {
    try {
      await api.put(`/moderator/reports/${id}/dismiss`);
      showToast("Report dismissed.", "info");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to dismiss report", "error");
    }
  };

  // Song status toggle handler
  const handleToggleSongStatus = async (songId, currentStatus) => {
    const newStatus = currentStatus === "moderated" ? "published" : "moderated";
    try {
      await api.put(`/moderator/songs/${songId}/status`, { status: newStatus });
      showToast(`Song status updated to ${newStatus}.`, "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update song status", "error");
    }
  };

  // Album status toggle handler
  const handleToggleAlbumStatus = async (albumId, currentStatus) => {
    const newStatus = currentStatus === "moderated" ? "published" : "moderated";
    try {
      await api.put(`/moderator/albums/${albumId}/status`, { status: newStatus });
      showToast(`Album status updated to ${newStatus}.`, "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update album status", "error");
    }
  };

  // User account status toggle handler
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Inactive" ? "Active" : "Inactive";
    try {
      await api.put(`/moderator/users/${userId}/status`, { status: newStatus });
      showToast(`User status updated to ${newStatus}.`, "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update user status", "error");
    }
  };

  const getStatusColor = (status) => {
    if (status === "pending" || status === "Pending") return "warning";
    if (status === "resolved" || status === "Resolved" || status === "published" || status === "Active") return "success";
    if (status === "dismissed" || status === "Dismissed" || status === "Inactive") return "default";
    return "error"; // For 'moderated'
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        
        {/* --- Left Sidebar --- */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#01F2EA", mb: 5, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 1 }}>
            SoundWave 🛡️
          </Typography>
          <List sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab(0)} sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: activeTab === 0 ? "rgba(1, 242, 234, 0.08)" : "transparent", color: activeTab === 0 ? "#01F2EA" : "#FFFFFF" }}>
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 0 ? "#01F2EA" : "#A2A0D5" }}><FlagIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Reports Queue" sx={{ "& .MuiListItemText-primary": { fontWeight: activeTab === 0 ? "bold" : 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab(1)} sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: activeTab === 1 ? "rgba(1, 242, 234, 0.08)" : "transparent", color: activeTab === 1 ? "#01F2EA" : "#FFFFFF" }}>
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 1 ? "#01F2EA" : "#A2A0D5" }}><MusicNoteIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Manage Songs" sx={{ "& .MuiListItemText-primary": { fontWeight: activeTab === 1 ? "bold" : 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab(2)} sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: activeTab === 2 ? "rgba(1, 242, 234, 0.08)" : "transparent", color: activeTab === 2 ? "#01F2EA" : "#FFFFFF" }}>
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 2 ? "#01F2EA" : "#A2A0D5" }}><AlbumIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Manage Albums" sx={{ "& .MuiListItemText-primary": { fontWeight: activeTab === 2 ? "bold" : 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab(3)} sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: activeTab === 3 ? "rgba(1, 242, 234, 0.08)" : "transparent", color: activeTab === 3 ? "#01F2EA" : "#FFFFFF" }}>
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 3 ? "#01F2EA" : "#A2A0D5" }}><GroupIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Manage Users" sx={{ "& .MuiListItemText-primary": { fontWeight: activeTab === 3 ? "bold" : 500 } }} />
              </ListItemButton>
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2, borderColor: "rgba(162,160,213,0.15)" }} />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><PersonIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="My Profile" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* --- Right Main Contents Area --- */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          {/* Header Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                {activeTab === 0 && "Moderation Reports Queue"}
                {activeTab === 1 && "Content Administration – Songs"}
                {activeTab === 2 && "Content Administration – Albums"}
                {activeTab === 3 && "Platform Accounts Directory"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                {activeTab === 0 && "Review reports submitted by users and lock violating tracks/profiles."}
                {activeTab === 1 && "Audit track lifecycle statuses, view plays/likes, and lock/restore tracks."}
                {activeTab === 2 && "Monitor album releases, edit status logs, and ban/restore albums."}
                {activeTab === 3 && "Audit platform users, update statuses, or deactivate accounts."}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} sx={{ borderRadius: 3, textTransform: "none", color: "#A2A0D5", borderColor: "rgba(162,160,213,0.3)", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}>
                Refresh
              </Button>
              <Chip icon={<ShieldIcon sx={{ color: "#01F2EA !important" }} />} label="Moderator Mode" sx={{ bgcolor: "rgba(1,242,234,0.08)", color: "#01F2EA", border: "1px solid rgba(1,242,234,0.3)", fontWeight: "bold" }} />
            </Box>
          </Box>

          {/* Core Dashboard UI Content Panels */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
              <CircularProgress sx={{ color: "#01F2EA" }} />
            </Box>
          ) : (
            <>
              {activeTab === 0 && (
                <ReportsTab
                  reports={reports}
                  getStatusColor={getStatusColor}
                  handleResolveReport={handleResolveReport}
                  handleDismissReport={handleDismissReport}
                />
              )}

              {activeTab === 1 && (
                <SongsTab
                  songs={songs}
                  getStatusColor={getStatusColor}
                  handleToggleSongStatus={handleToggleSongStatus}
                />
              )}

              {activeTab === 2 && (
                <AlbumsTab
                  albums={albums}
                  getStatusColor={getStatusColor}
                  handleToggleAlbumStatus={handleToggleAlbumStatus}
                />
              )}

              {activeTab === 3 && (
                <UsersTab
                  users={users}
                  getStatusColor={getStatusColor}
                  handleToggleUserStatus={handleToggleUserStatus}
                />
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Styled SnackBar Toast Alerts */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%", borderRadius: 3, fontWeight: "bold", bgcolor: toast.severity === "success" ? "#10B981" : toast.severity === "info" ? "#01F2EA" : "#EF4444", color: "#100B29", "& .MuiAlert-icon": { color: "#100B29" } }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
