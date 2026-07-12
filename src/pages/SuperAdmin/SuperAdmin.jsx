import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Shield as ShieldIcon,
  MusicNote as MusicNoteIcon,
  Mic as MicIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  WarningAmber as WarningAmberIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  PlaylistPlay,
  Group,
  PersonAdd,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";

// ===== HARDCODED NEON DARK THEME =====
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#01F2EA" }, // Neon Cyan
    secondary: { main: "#CE04F2" }, // Neon Magenta
    background: { default: "#100B29", paper: "#1A153A" }, // Deep Purple
    text: { primary: "#FFFFFF", secondary: "#A2A0D5" }, // White and Soft Lavender
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(162, 160, 213, 0.15)",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, user: null });

  useEffect(() => {
    if (location.state?.tab) {
      setCurrentTab(location.state.tab);
    }
  }, [location.state]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/superadmin/users");
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

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await api.put(`/superadmin/users/${userId}/status`, { status: newStatus });
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

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleDeleteUser = async () => {
    const user = deleteConfirm.user;
    if (!user) return;
    try {
      const res = await api.delete(`/superadmin/users/${user.user_id}`);
      showToast(res.data.message, "success");
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      setDeleteConfirm({ open: false, user: null });
      if (selectedUser && selectedUser.user_id === user.user_id) {
        setSelectedUser(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete user";
      showToast(msg, "error");
      setDeleteConfirm({ open: false, user: null });
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
  const adminsCount = users.filter((u) => u.role_name === "Admin").length;
  const artistsCount = users.filter((u) => u.role_name === "Artist").length;
  const listenerCount = users.filter((u) => u.role_name === "Listener").length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const inactiveUsersCount = users.filter((u) => u.status === "Inactive").length;

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case "Super Admin": return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Admin": return "linear-gradient(135deg, #01F2EA, #00A3A6)";
      case "Artist": return "linear-gradient(135deg, #CE04F2, #7B0291)";
      case "Listener": return "linear-gradient(135deg, #A2A0D5, #5A5885)";
      default: return "linear-gradient(135deg, #616161, #212121)";
    }
  };

  const selectStyles = {
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(162, 160, 213, 0.2)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#01F2EA" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#01F2EA" },
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>

        {/* Sidebar Left Navigation Panel */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)",  top: 0, height: "100vh",  }}>


          <Divider sx={{ mb: 2, borderColor: "rgba(162, 160, 213, 0.15)" }} />

          <List sx={{ display: "", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("dashboard")}
                selected={currentTab === "dashboard"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "dashboard" ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: currentTab === "dashboard" ? "#01F2EA" : "#FFFFFF",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "dashboard" ? "#01F2EA" : "#A2A0D5" }}>
                  <HomeIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" slotProps={{ primary: { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("users")}
                selected={currentTab === "users"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "users" ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: currentTab === "users" ? "#01F2EA" : "#FFFFFF",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "users" ? "#01F2EA" : "#A2A0D5" }}>
                  <PeopleIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Users" slotProps={{ primary: { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/admins")}
                sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}>
                  <ShieldIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Admins" slotProps={{ primary: { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(162, 160, 213, 0.15)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              System Mocks
            </Typography>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("songs")}
                selected={currentTab === "songs"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "songs" ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: currentTab === "songs" ? "#01F2EA" : "#FFFFFF",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "songs" ? "#01F2EA" : "#A2A0D5" }}>
                  <MusicNoteIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Songs" slotProps={{ primary: { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("artists")}
                selected={currentTab === "artists"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "artists" ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: currentTab === "artists" ? "#01F2EA" : "#FFFFFF",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "artists" ? "#01F2EA" : "#A2A0D5" }}>
                  <MicIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Artists" slotProps={{ primary: { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("reports")}
                selected={currentTab === "reports"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "reports" ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: currentTab === "reports" ? "#01F2EA" : "#FFFFFF",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "reports" ? "#01F2EA" : "#A2A0D5" }}>
                  <AssessmentIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Reports" slotProps={{ primary: { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(162, 160, 213, 0.15)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              Account
            </Typography>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Profile" slotProps={{ primary: { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}>
                  <ExitToAppIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Logout" slotProps={{ primary: { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Workspace Layout Workspace */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>

          <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Manage system users, activate/deactivate accounts, and monitor registrations.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </Alert>
          )}

          {/* Tab Content Dashboard Engine */}
          {currentTab === "dashboard" && (
            <Box>
              {/* Metric Card rows grids - FIXED SAME SIZE */}
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                {[
                  { title: "Total Users", value: totalUsersCount, color: "#FFFFFF" },
                  { title: "System Admins", value: adminsCount, color: "#01F2EA" },
                  { title: "Artists Registered", value: artistsCount, color: "#CE04F2" },
                  { title: "Listener Registered", value: listenerCount, color: "#A2A0D5" },
                  { title: "Active Statuses", value: activeUsersCount, color: "#00BCD4" },
                  { title: "Inactive Statuses", value: inactiveUsersCount, color: "#F44336" },
                ].map((stat) => (
                  <Card key={stat.title} sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    borderRadius: 4, 
                    border: "1px solid rgba(162, 160, 213, 0.15)", 
                    bgcolor: "background.paper", 
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)", 
                    minHeight: 160,
                    transition: "all 0.25s", 
                    "&:hover": { 
                      transform: "translateY(-2px)", 
                      borderColor: stat.color !== "#FFFFFF" ? stat.color : "rgba(162, 160, 213, 0.4)" 
                    } 
                  }}>
                    <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: stat.color }}>
                        {loading ? <CircularProgress size={24} /> : stat.value.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                  Recent Registered Users
                </Typography>
                <Button onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold", color: "#01F2EA", "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                  View All Users →
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", overflow: "hidden" }}>
                {loading ? (
                  <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
                ) : users.length === 0 ? (
                  <Typography sx={{ p: 4, color: "text.secondary", textAlign: "center" }}>No registered users found.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 5).map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                          <TableCell sx={{ fontWeight: "600", color: "#FFFFFF" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "#A2A0D5" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={user.status || "Active"} size="small" variant="outlined" color={user.status === "Inactive" ? "error" : "success"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Box>
          )}

          {/* Manage Users Content panel workspace tab */}
          {currentTab === "users" && (
            <Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, border: "1px solid rgba(162, 160, 213, 0.2)" }}>
                  <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", color: "#FFFFFF", width: "100%", padding: "12px 0", fontSize: 14 }}
                  />
                </Box>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="role-select-label" sx={{ color: "text.secondary" }}>Role</InputLabel>
                  <Select labelId="role-select-label" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} label="Role" sx={{ borderRadius: 3, ...selectStyles }}>
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                    <MenuItem value="Artist">Artist</MenuItem>
                    <MenuItem value="Listener">Listener</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="status-select-label" sx={{ color: "text.secondary" }}>Status</InputLabel>
                  <Select labelId="status-select-label" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: 3, ...selectStyles }}>
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
                {loading ? (
                  <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
                ) : filteredUsers.length === 0 ? (
                  <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No users match your criteria.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                          <TableCell sx={{ fontWeight: "600" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "#A2A0D5" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={user.status || "Active"} size="small" variant="outlined" color={user.status === "Inactive" ? "error" : "success"} />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Tooltip title="View Details">
                                <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={() => setSelectedUser(user)} sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(162,160,213,0.3)", color: "#A2A0D5", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}>
                                  View
                                </Button>
                              </Tooltip>
                              <Button variant="outlined" color={user.status === "Inactive" ? "primary" : "error"} size="small" onClick={() => toggleUserStatus(user.user_id, user.status || "Active")} sx={{ textTransform: "none", borderRadius: 2 }}>
                                {user.status === "Inactive" ? "Activate" : "Deactivate"}
                              </Button>
                              <Button variant="outlined" color="error" size="small" startIcon={<DeleteForeverIcon />} onClick={() => setDeleteConfirm({ open: true, user })} sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(220,38,38,0.3)" }}>
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Box>
          )}

          {/* Manage Songs Workspace */}
          {currentTab === "songs" && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
                Catalog Songs Management
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
                {catalogSongs.length === 0 ? (
                  <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No songs found in catalog.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Song Info</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Artist</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Album</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {catalogSongs.map((song) => (
                        <TableRow key={song.song_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                                {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                              </Box>
                              <Typography sx={{ fontWeight: "600" }}>{song.title}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{song.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{song.Album?.title || "Single"}</TableCell>
                          <TableCell>
                            {song.Category?.name && <Chip label={song.Category.name} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteSong(song.song_id)} sx={{ textTransform: "none", borderRadius: 2 }}>
                              Delete Song
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Box>
          )}

          {/* Manage Artists Panel */}
          {currentTab === "artists" && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
                Catalog Artists Management
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
                {catalogArtists.length === 0 ? (
                  <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No artist profiles found.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Artist Info</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Biography</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {catalogArtists.map((artist) => (
                        <TableRow key={artist.artist_profile_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                                {artist.profile_image ? <Box component="img" src={artist.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <PersonIcon sx={{ color: "#01F2EA" }} />}
                              </Box>
                              <Typography sx={{ fontWeight: "600" }}>{artist.stage_name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{artist.User?.username || "N/A"}</TableCell>
                          <TableCell sx={{ color: "text.secondary", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artist.bio || "No biography provided."}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteArtistProfile(artist.user_id)} sx={{ textTransform: "none", borderRadius: 2 }}>
                              Delete Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Box>
          )}

          {/* Reports Analytics View */}
          {currentTab === "reports" && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
                System Reports & Analysis
              </Typography>
              <Grid container spacing={3}>
                {[
                  { title: "Total System Tracks", value: catalogSongs.length, color: "#01F2EA" },
                  { title: "Featured Artists", value: catalogArtists.length, color: "#CE04F2" },
                  { title: "Music Categories", value: catalogCategories.length, color: "#A2A0D5" },
                ].map((card) => (
                  <Grid item xs={12} md={4} key={card.title}>
                    <Card sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", textAlign: "center" }}>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>{card.title}</Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", color: card.color }}>{card.value}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Card sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", mt: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Breakdown of Songs by Genre / Category</Typography>
                  <Divider sx={{ mb: 3, borderColor: "rgba(162,160,213,0.15)" }} />
                  {catalogCategories.map((cat) => {
                    const count = catalogSongs.filter(s => s.Category?.name === cat.name).length;
                    const percent = catalogSongs.length > 0 ? (count / catalogSongs.length) * 100 : 0;
                    return (
                      <Box key={cat.category_id} sx={{ mb: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>{cat.name}</Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>{count} tracks ({percent.toFixed(1)}%)</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.05)", "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: "#01F2EA" } }} />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      {/* Permanent Deletion Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, user: null })}
        slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(239, 68, 68, 0.3)", minWidth: 420 } } }}
      >
        {deleteConfirm.user && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.15)", display: "flex", alignItems: "center", gap: 1, color: "#FFFFFF" }}>
              <WarningAmberIcon sx={{ color: "#EF4444" }} />
              Confirm Permanent Deletion
              <IconButton onClick={() => setDeleteConfirm({ open: false, user: null })} sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                This action is <strong>irreversible</strong>. The user will be permanently removed from the database.
              </Alert>
              <Box sx={{ bgcolor: "rgba(255, 255, 255, 0.02)", borderRadius: 2, p: 2, border: "1px solid rgba(162, 160, 213, 0.1)" }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>Account to be deleted:</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{deleteConfirm.user.username}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{deleteConfirm.user.email}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Role: <strong style={{ color: "#FFFFFF" }}>{deleteConfirm.user.role_name}</strong></Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1, borderTop: "1px solid rgba(162,160,213,0.15)" }}>
              <Button variant="outlined" fullWidth onClick={() => setDeleteConfirm({ open: false, user: null })} sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", borderColor: "rgba(162, 160, 213, 0.3)", color: "text.secondary" }}>
                Cancel
              </Button>
              <Button variant="contained" color="error" fullWidth startIcon={<DeleteForeverIcon />} onClick={handleDeleteUser} sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}>
                Delete Permanently
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* User Complex Detail Modal Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162, 160, 213, 0.2)", overflow: "hidden" } }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 0, position: "relative", background: "linear-gradient(135deg, rgba(1,242,234,0.05) 0%, rgba(16,11,41,0) 60%)" }}>
              <Box sx={{ p: 4, pb: 3, display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: 28, fontWeight: "bold", background: getAvatarColor(selectedUser.role_name), border: "3px solid #1A153A" }}>
                  {getInitials(selectedUser.username)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>
                    {selectedUser.username}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
                    {selectedUser.email}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip label={selectedUser.role_name} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", fontWeight: "bold", color: "#01F2EA" }} />
                    <Chip label={selectedUser.status || "Active"} size="small" variant="outlined" color={selectedUser.status === "Inactive" ? "error" : "success"} sx={{ fontWeight: "bold" }} />
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedUser(null)} sx={{ color: "text.secondary", alignSelf: "flex-start" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ px: 4, pb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 3, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "rgba(255,255,255,0.01)", height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: "#FFFFFF" }}>📋 Basic Information</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {[
                            { label: "User ID", val: `#${selectedUser.user_id}`, icon: <InfoIcon sx={{ fontSize: 18, color: "#01F2EA" }} /> },
                            { label: "System Role", val: selectedUser.role_name, icon: <ShieldIcon sx={{ fontSize: 18, color: "#CE04F2" }} /> },
                            { label: "Joined Date", val: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "N/A", icon: <CalendarTodayIcon sx={{ fontSize: 18, color: "#01F2EA" }} /> },
                            { label: "Home Address", val: selectedUser.address || "Not Provided", icon: <LocationOnIcon sx={{ fontSize: 18, color: "#CE04F2" }} /> },
                          ].map((item, idx) => (
                            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, pb: idx < 3 ? 1.5 : 0, borderBottom: idx < 3 ? "1px solid rgba(162, 160, 213, 0.1)" : "none" }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</Box>
                              <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>{item.label}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{item.val}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: 3, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "rgba(255,255,255,0.01)", mb: 2.5 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: "#FFFFFF" }}>📍 Contact Information</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2, border: "1px solid rgba(162, 160, 213, 0.1)" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                <EmailIcon sx={{ fontSize: 18, color: "#01F2EA" }} />
                                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>Email</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "500", color: "#FFFFFF", wordBreak: "break-all" }}>{selectedUser.email}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2, border: "1px solid rgba(162, 160, 213, 0.1)" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                <PhoneIcon sx={{ fontSize: 18, color: "#CE04F2" }} />
                                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>Phone</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "500", color: "#FFFFFF" }}>{selectedUser.phone || "Not Provided"}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "rgba(255,255,255,0.01)" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: "#FFFFFF" }}>📊 Activity Overview</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                          {[
                            { name: "Songs Played", value: selectedUser.songs_played || 0, max: 2000, barColor: "#01F2EA" },
                            { name: "Playlists Created", value: selectedUser.playlists_count || 0, max: 30, barColor: "#CE04F2" },
                            { name: "Followers", value: selectedUser.followers_count || 0, max: 500, barColor: "#01F2EA" },
                            { name: "Following", value: selectedUser.following_count || 0, max: 300, barColor: "#CE04F2" },
                          ].map((bar, idx) => (
                            <Box key={idx}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>{bar.name}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{bar.value}</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={Math.min((bar.value / bar.max) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", "& .MuiLinearProgress-bar": { bgcolor: bar.barColor, borderRadius: 3 } }} />
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, px: 4, gap: 1.5, borderTop: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "rgba(0,0,0,0.15)" }}>
              <Button variant="outlined" fullWidth startIcon={<EditIcon />} sx={{ borderRadius: 3, py: 1.2, textTransform: "none", fontWeight: "bold", borderColor: "rgba(162, 160, 213, 0.3)", color: "text.secondary", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}>
                Edit Details
              </Button>
              <Button variant="contained" fullWidth color={selectedUser.status === "Inactive" ? "primary" : "error"} onClick={() => toggleUserStatus(selectedUser.user_id, selectedUser.status || "Active")} sx={{ borderRadius: 3, py: 1.2, textTransform: "none", fontWeight: "bold" }}>
                {selectedUser.status === "Inactive" ? "✅ Activate Account" : "⛔ Deactivate Account"}
              </Button>
              <Button variant="outlined" fullWidth color="error" startIcon={<DeleteForeverIcon />} onClick={() => { setSelectedUser(null); setDeleteConfirm({ open: true, user: selectedUser }); }} sx={{ borderRadius: 3, py: 1.2, textTransform: "none", fontWeight: "bold", borderColor: "rgba(220,38,38,0.5)" }}>
                Delete User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}