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
  MusicNote,
  PlaylistPlay,
  Group,
  PersonAdd,
  Visibility as VisibilityIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";

// ===== LIGHT THEME =====
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F97316",
    },
    background: {
      default: "#FFF5F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

// ===== DARK THEME =====
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F97316",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== DARK MODE STATE =====
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("superAdminDarkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("superAdminDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const [currentTab, setCurrentTab] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchUsers();
  }, []);

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
      case "Admin": return "linear-gradient(135deg, #4fc3f7, #0288d1)";
      case "Artist": return "linear-gradient(135deg, #e91e63, #9c27b0)";
      case "Listener": return "linear-gradient(135deg, #1db954, #0d7a3a)";
      default: return "linear-gradient(135deg, #9e9e9e, #616161)";
    }
  };

  // ===== DYNAMIC COLORS BASED ON THEME =====
  const sidebarBg = darkMode ? "#1E293B" : "#FFFFFF";
  const sidebarText = darkMode ? "#F1F5F9" : "#64748B";
  const sidebarIcon = darkMode ? "#94A3B8" : "#94A3B8";
  const sidebarHover = darkMode ? "#334155" : "#FFF5F0";
  const selectedBg = darkMode ? "#334155" : "#FFF5F0";
  const mainBg = darkMode ? "#0F172A" : "#FFF5F0";
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const cardBorder = darkMode ? "#334155" : "#FFF0E6";
  const tableHeaderBg = darkMode ? "#1E293B" : "#FFF8F5";
  const tableRowHover = darkMode ? "#334155 !important" : "#FFF8F5 !important";
  const textPrimary = darkMode ? "#F1F5F9" : "#1E293B";
  const textSecondary = darkMode ? "#94A3B8" : "#94A3B8";
  const inputBg = darkMode ? "#1E293B" : "#FFFFFF";
  const inputBorder = darkMode ? "#334155" : "#FFF0E6";
  const dialogContentBg = darkMode ? "#1E293B" : "#FFFFFF";
  const detailCardBg = darkMode ? "#334155" : "#FFF8F5";
  const detailCardBorder = darkMode ? "#475569" : "#FFF0E6";
  const infoBoxBg = darkMode ? "#1E293B" : "#FFFFFF";
  const actionsBg = darkMode ? "#334155" : "#FFF8F5";
  const dividerColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const chipBg = darkMode ? "#334155" : "#F8FAFC";
  const chipBorder = darkMode ? "#475569" : "#E2E8F0";
  const statusActiveBg = darkMode ? "#064E3B" : "#ECFDF5";
  const statusActiveBorder = darkMode ? "#10B981" : "#A7F3D0";
  const statusInactiveBg = darkMode ? "#450A0A" : "#FEF2F2";
  const statusInactiveBorder = darkMode ? "#EF4444" : "#FECACA";
  const progressTrack = darkMode ? "#334155" : "#F1F5F9";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: mainBg }}>

        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: sidebarBg, p: 3, display: "flex", flexDirection: "column", boxShadow: "0 0 20px rgba(0,0,0,0.03)" }}>

          {/* ===== DARK MODE TOGGLE BUTTON ===== */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
            <Typography variant="caption" sx={{ color: textSecondary, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Typography>
            <IconButton 
              onClick={toggleDarkMode}
              sx={{ 
                color: darkMode ? "#F59E0B" : "#F97316",
                bgcolor: darkMode ? "rgba(245,158,11,0.1)" : "rgba(249,115,22,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: darkMode ? "rgba(245,158,11,0.2)" : "rgba(249,115,22,0.2)",
                  transform: "rotate(15deg)",
                }
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, borderColor: dividerColor }} />

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("dashboard")}
                selected={currentTab === "dashboard"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "dashboard" ? selectedBg : "transparent",
                  color: currentTab === "dashboard" ? "#F97316" : sidebarText,
                  "&.Mui-selected": { bgcolor: selectedBg, color: "#F97316" },
                  "&:hover": { bgcolor: sidebarHover },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "dashboard" ? "#F97316" : sidebarIcon }}>
                  <HomeIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  slotProps={{ primary: { fontWeight: currentTab === "dashboard" ? "bold" : "500" } }} 
                />
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
                  bgcolor: currentTab === "users" ? selectedBg : "transparent",
                  color: currentTab === "users" ? "#F97316" : sidebarText,
                  "&.Mui-selected": { bgcolor: selectedBg, color: "#F97316" },
                  "&:hover": { bgcolor: sidebarHover },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "users" ? "#F97316" : sidebarIcon }}>
                  <PeopleIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Manage Users" 
                  slotProps={{ primary: { fontWeight: currentTab === "users" ? "bold" : "500" } }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/admins")}
                sx={{ borderRadius: 3, py: 1.2, px: 2, color: sidebarText, "&:hover": { bgcolor: sidebarHover } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: sidebarIcon }}>
                  <ShieldIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Manage Admins" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: dividerColor }} />
            <Typography variant="caption" sx={{ px: 2, color: textSecondary, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              System Mocks
            </Typography>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton sx={{ borderRadius: 3, py: 1.2, px: 2, color: sidebarText }}>
                <ListItemIcon sx={{ minWidth: 36, color: sidebarIcon }}>
                  <MusicNoteIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Manage Songs" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton sx={{ borderRadius: 3, py: 1.2, px: 2, color: sidebarText }}>
                <ListItemIcon sx={{ minWidth: 36, color: sidebarIcon }}>
                  <MicIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Manage Artists" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton sx={{ borderRadius: 3, py: 1.2, px: 2, color: sidebarText }}>
                <ListItemIcon sx={{ minWidth: 36, color: sidebarIcon }}>
                  <AssessmentIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Reports" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: dividerColor }} />
            <Typography variant="caption" sx={{ px: 2, color: textSecondary, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              Account
            </Typography>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: sidebarText, "&:hover": { bgcolor: sidebarHover } }}>
                <ListItemIcon sx={{ minWidth: 36, color: sidebarIcon }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: darkMode ? "#450A0A" : "#FEF2F2" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}>
                  <ExitToAppIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  slotProps={{ primary: { fontWeight: 500 } }} 
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, pb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: textPrimary }}>
                Super Admin Dashboard
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: textSecondary, fontSize: "1rem" }}>
              Manage system users, activate/deactivate accounts, and monitor registrations.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: darkMode ? "#450A0A" : "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </Alert>
          )}

          {/* Dashboard Tab */}
          {currentTab === "dashboard" && (
            <Box>
              {/* Stats Cards */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Total Users
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: textPrimary }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : totalUsersCount.toLocaleString()}
                      </Typography>

                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        System Admins
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#6366F1" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : adminsCount}
                      </Typography>

                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Artists Registered
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#E91E63" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : artistsCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Listener Registered
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#BDBDBD" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : listenerCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Active Statuses
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#00BCD4" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : activeUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg, transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        InActive Statuses
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#F44336" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : inactiveUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Users List */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: textPrimary }}>
                  Recent Registered Users
                </Typography>
                <Button onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold", color: "#F97316", "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                  View All Users →
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg }}>
                {loading ? (
                  <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : users.length === 0 ? (
                  <Typography sx={{ p: 4, color: textSecondary, textAlign: "center" }}>No registered users found.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: tableHeaderBg }}>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 5).map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: tableRowHover } }}>
                          <TableCell sx={{ fontWeight: "600", color: textPrimary }}>{user.username}</TableCell>
                          <TableCell sx={{ color: textSecondary }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: chipBg, border: `1px solid ${chipBorder}`, fontSize: "0.75rem", fontWeight: "medium", color: textSecondary }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? statusActiveBg : statusInactiveBg, border: user.status === "Active" ? `1px solid ${statusActiveBorder}` : `1px solid ${statusInactiveBorder}`, color: user.status === "Active" ? "#059669" : "#DC2626", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {user.status || "Active"}
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

          {/* Manage Users Tab */}
          {currentTab === "users" && (
            <Box>
              {/* Search and Filters */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: inputBg, borderRadius: 3, px: 2, border: `1px solid ${inputBorder}`, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <SearchIcon sx={{ color: textSecondary, mr: 1.5 }} />
                  <TextField
                    variant="standard"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true } }}
                    sx={{ py: 1 }}
                  />
                </Box>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select labelId="role-select-label" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} label="Role">
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                    <MenuItem value="Artist">Artist</MenuItem>
                    <MenuItem value="Listener">Listener</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select labelId="status-select-label" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${cardBorder}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: cardBg }}>
                {loading ? (
                  <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Typography sx={{ p: 6, color: textSecondary, textAlign: "center" }}>No users match your criteria.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: tableHeaderBg }}>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: textSecondary, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: tableRowHover } }}>
                          <TableCell sx={{ fontWeight: "600", color: textPrimary }}>{user.username}</TableCell>
                          <TableCell sx={{ color: textSecondary }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: chipBg, border: `1px solid ${chipBorder}`, fontSize: "0.75rem", fontWeight: "medium", color: textSecondary }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? statusActiveBg : statusInactiveBg, border: user.status === "Active" ? `1px solid ${statusActiveBorder}` : `1px solid ${statusInactiveBorder}`, color: user.status === "Active" ? "#059669" : "#DC2626", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {user.status || "Active"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Tooltip title="View Details">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => setSelectedUser(user)}
                                  sx={{ textTransform: "none", borderRadius: 2, borderColor: chipBorder, color: textSecondary, "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: darkMode ? "rgba(249,115,22,0.1)" : "#FFF5F0" } }}
                                >
                                  View
                                </Button>
                              </Tooltip>
                              <Button
                                variant="outlined"
                                color={user.status === "Inactive" ? "primary" : "error"}
                                size="small"
                                onClick={() => toggleUserStatus(user.user_id, user.status || "Active")}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                              >
                                {user.status === "Inactive" ? "Activate" : "Deactivate"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteForeverIcon />}
                                onClick={() => setDeleteConfirm({ open: true, user })}
                                sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(220,38,38,0.3)", color: "#DC2626", "&:hover": { bgcolor: darkMode ? "#450A0A" : "#FEF2F2" } }}
                              >
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
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, user: null })}
        slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: dialogContentBg, border: "1px solid #FECACA", minWidth: 420 } } }}
      >
        {deleteConfirm.user && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: `1px solid ${cardBorder}`, display: "flex", alignItems: "center", gap: 1, color: textPrimary }}>
              <WarningAmberIcon sx={{ color: "#DC2626" }} />
              Confirm Permanent Deletion
              <IconButton onClick={() => setDeleteConfirm({ open: false, user: null })} sx={{ position: "absolute", right: 16, top: 16, color: textSecondary }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2, bgcolor: darkMode ? "#450A0A" : "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                This action is <strong>irreversible</strong>. The user will be permanently removed from the database.
              </Alert>
              <Box sx={{ bgcolor: darkMode ? "#1E293B" : "#F8FAFC", borderRadius: 2, p: 2, border: `1px solid ${cardBorder}` }}>
                <Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Account to be deleted:</Typography>
                <Typography sx={{ fontWeight: "bold", color: textPrimary }}>{deleteConfirm.user.username}</Typography>
                <Typography variant="body2" sx={{ color: textSecondary }}>{deleteConfirm.user.email}</Typography>
                <Typography variant="body2" sx={{ color: textSecondary, mt: 0.5 }}>Role: <strong style={{ color: textPrimary }}>{deleteConfirm.user.role_name}</strong></Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1, borderTop: `1px solid ${cardBorder}` }}>
              <Button variant="outlined" fullWidth onClick={() => setDeleteConfirm({ open: false, user: null })} sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", borderColor: chipBorder, color: textSecondary }}>
                Cancel
              </Button>
              <Button variant="contained" color="error" fullWidth startIcon={<DeleteForeverIcon />} onClick={handleDeleteUser} sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}>
                Delete Permanently
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: dialogContentBg, border: `1px solid ${cardBorder}`, overflow: "hidden" } }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 0, position: "relative", background: darkMode ? "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(30,41,59,0) 60%)" : "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(255,255,255,0) 60%)" }}>
              <Box sx={{ p: 4, pb: 3, display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: 28, fontWeight: "bold", background: getAvatarColor(selectedUser.role_name), border: `3px solid ${cardBorder}` }}>
                  {getInitials(selectedUser.username)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5, color: textPrimary }}>
                    {selectedUser.username}
                  </Typography>
                  <Typography variant="body1" sx={{ color: textSecondary, mb: 1 }}>
                    {selectedUser.email}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip label={selectedUser.role_name} size="small" sx={{ bgcolor: chipBg, border: `1px solid ${chipBorder}`, fontWeight: "bold", color: selectedUser.role_name === "Super Admin" ? "#F59E0B" : selectedUser.role_name === "Admin" ? "#3B82F6" : selectedUser.role_name === "Artist" ? "#E91E63" : "#059669" }} />
                    <Chip label={selectedUser.status || "Active"} size="small" sx={{ bgcolor: selectedUser.status === "Inactive" ? statusInactiveBg : statusActiveBg, border: selectedUser.status === "Inactive" ? `1px solid ${statusInactiveBorder}` : `1px solid ${statusActiveBorder}`, fontWeight: "bold", color: selectedUser.status === "Inactive" ? "#DC2626" : "#059669" }} />
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedUser(null)} sx={{ color: textSecondary, alignSelf: "flex-start" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ px: 4, pb: 4 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ borderRadius: 3, border: `1px solid ${detailCardBorder}`, bgcolor: detailCardBg, height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: textPrimary }}>
                          📋 Basic Information
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1.5, borderBottom: `1px solid ${detailCardBorder}` }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: darkMode ? "#334155" : "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <InfoIcon sx={{ fontSize: 18, color: "#F97316" }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>User ID</Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>#{selectedUser.user_id}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1.5, borderBottom: `1px solid ${detailCardBorder}` }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: darkMode ? "#1E3A5F" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ShieldIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>System Role</Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#3B82F6" }}>{selectedUser.role_name}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1.5, borderBottom: `1px solid ${detailCardBorder}` }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: darkMode ? "#451A03" : "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CalendarTodayIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>Joined Date</Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>
                                {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1.5, borderBottom: `1px solid ${detailCardBorder}` }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: darkMode ? "#3B0764" : "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <AccessTimeIcon sx={{ fontSize: 18, color: "#9333EA" }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>Last Active</Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>
                                {selectedUser.last_active ? new Date(selectedUser.last_active).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: darkMode ? "#450A0A" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <LocationOnIcon sx={{ fontSize: 18, color: "#DC2626" }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>Home Address</Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>{selectedUser.address || "Not Provided"}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: 3, border: `1px solid ${detailCardBorder}`, bgcolor: detailCardBg, mb: 2.5 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: textPrimary }}>📍 Contact Information</Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ bgcolor: infoBoxBg, p: 2, borderRadius: 2, border: `1px solid ${detailCardBorder}` }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                <EmailIcon sx={{ fontSize: 18, color: "#F97316" }} />
                                <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>Email</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "500", color: textPrimary, wordBreak: "break-all" }}>{selectedUser.email}</Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ bgcolor: infoBoxBg, p: 2, borderRadius: 2, border: `1px solid ${detailCardBorder}` }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                <PhoneIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
                                <Typography variant="caption" sx={{ color: textSecondary, textTransform: "uppercase", fontWeight: "bold" }}>Phone</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "500", color: textPrimary }}>{selectedUser.phone || "Not Provided"}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3, border: `1px solid ${detailCardBorder}`, bgcolor: detailCardBg }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2.5, color: textPrimary }}>📊 Activity Overview</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <MusicNote sx={{ fontSize: 18, color: "#059669" }} />
                                <Typography variant="body2" sx={{ color: textSecondary }}>Songs Played</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>{selectedUser.songs_played || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min(((selectedUser.songs_played || 0) / 2000) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: progressTrack, "& .MuiLinearProgress-bar": { bgcolor: "#059669", borderRadius: 3 } }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <PlaylistPlay sx={{ fontSize: 18, color: "#F59E0B" }} />
                                <Typography variant="body2" sx={{ color: textSecondary }}>Playlists Created</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>{selectedUser.playlists_count || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min(((selectedUser.playlists_count || 0) / 30) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: progressTrack, "& .MuiLinearProgress-bar": { bgcolor: "#F59E0B", borderRadius: 3 } }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Group sx={{ fontSize: 18, color: "#E91E63" }} />
                                <Typography variant="body2" sx={{ color: textSecondary }}>Followers</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>{selectedUser.followers_count || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min(((selectedUser.followers_count || 0) / 500) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: progressTrack, "& .MuiLinearProgress-bar": { bgcolor: "#E91E63", borderRadius: 3 } }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <PersonAdd sx={{ fontSize: 18, color: "#00BCD4" }} />
                                <Typography variant="body2" sx={{ color: textSecondary }}>Following</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: textPrimary }}>{selectedUser.following_count || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min(((selectedUser.following_count || 0) / 300) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: progressTrack, "& .MuiLinearProgress-bar": { bgcolor: "#00BCD4", borderRadius: 3 } }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, px: 4, gap: 1.5, borderTop: `1px solid ${detailCardBorder}`, bgcolor: actionsBg }}>
              <Button variant="outlined" fullWidth startIcon={<EditIcon />} sx={{ borderRadius: 3, py: 1.2, textTransform: "none", fontWeight: "bold", borderColor: chipBorder, color: textSecondary, "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: darkMode ? "rgba(249,115,22,0.1)" : "#FFF5F0" } }}>
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
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}