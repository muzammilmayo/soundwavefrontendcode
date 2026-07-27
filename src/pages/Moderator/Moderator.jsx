import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
              {/* === TAB 0: Moderation Reports === */}
              {activeTab === 0 && (
                <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Reporter</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Target Details</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Reason</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                            No reports submitted yet. The system is clean!
                          </TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report) => (
                          <TableRow key={report.report_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                            <TableCell>{report.report_id}</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>{report.reporter}</TableCell>
                            <TableCell>
                              <Chip label={report.target_type.toUpperCase()} size="small" sx={{ bgcolor: "rgba(206,4,242,0.1)", color: "#CE04F2", border: "1px solid rgba(206,4,242,0.3)", fontWeight: "bold", fontSize: "0.7rem" }} />
                            </TableCell>
                            <TableCell sx={{ fontWeight: "500" }}>{report.title}</TableCell>
                            <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{report.reason}</TableCell>
                            <TableCell>
                              <Chip label={report.status} color={getStatusColor(report.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                <Button variant="outlined" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleResolveReport(report.report_id)} disabled={report.status !== "pending"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>
                                  Resolve
                                </Button>
                                <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleDismissReport(report.report_id)} disabled={report.status !== "pending"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>
                                  Dismiss
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* === TAB 1: Songs Management === */}
              {activeTab === 1 && (
                <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Cover</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Artist</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Plays</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {songs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                            No songs found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        songs.map((song) => (
                          <TableRow key={song.song_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                            <TableCell>{song.song_id}</TableCell>
                            <TableCell>
                              <Box sx={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {song.cover_image ? <img src={song.cover_image} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 18 }} />}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>{song.title}</TableCell>
                            <TableCell>{song.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                            <TableCell>{song.Category?.name || "Uncategorized"}</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#CE04F2" }}>{song.play_count || 0}</TableCell>
                            <TableCell>
                              <Chip label={song.status} color={getStatusColor(song.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                variant="outlined"
                                color={song.status === "moderated" ? "primary" : "error"}
                                size="small"
                                onClick={() => handleToggleSongStatus(song.song_id, song.status)}
                                sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                              >
                                {song.status === "moderated" ? "Restore / Approve" : "Lock / Ban Track"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* === TAB 2: Albums Management === */}
              {activeTab === 2 && (
                <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Cover</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Artist</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Release Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {albums.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                            No albums found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        albums.map((album) => (
                          <TableRow key={album.album_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                            <TableCell>{album.album_id}</TableCell>
                            <TableCell>
                              <Box sx={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {album.cover_image ? <img src={album.cover_image} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 18 }} />}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>{album.title}</TableCell>
                            <TableCell>{album.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                            <TableCell>{album.release_date || "N/A"}</TableCell>
                            <TableCell>
                              <Chip label={album.status} color={getStatusColor(album.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                variant="outlined"
                                color={album.status === "moderated" ? "primary" : "error"}
                                size="small"
                                onClick={() => handleToggleAlbumStatus(album.album_id, album.status)}
                                sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                              >
                                {album.status === "moderated" ? "Restore / Approve" : "Lock / Ban Album"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* === TAB 3: Users Management === */}
              {activeTab === 3 && (
                <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>User ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((item) => (
                          <TableRow key={item.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                            <TableCell>{item.user_id}</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>{item.username}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              <Chip label={item.role_name || "Listener"} size="small" sx={{ bgcolor: "rgba(1,242,234,0.05)", color: "#01F2EA" }} />
                            </TableCell>
                            <TableCell>
                              <Chip label={item.status || "Active"} color={getStatusColor(item.status || "Active")} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                variant="outlined"
                                color={item.status === "Inactive" ? "success" : "error"}
                                size="small"
                                onClick={() => handleToggleUserStatus(item.user_id, item.status || "Active")}
                                disabled={item.role_name === "Super Admin" || item.user_id === 1} // Prevent locking Super Admins
                                sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                              >
                                {item.status === "Inactive" ? "Activate Account" : "Lock / Deactivate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
