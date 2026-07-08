import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  MusicNote as MusicNoteIcon,
  Mic as MicIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
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

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFF5F0" }}>

        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "#FFFFFF", p: 3, display: "flex", flexDirection: "column", boxShadow: "0 0 20px rgba(0,0,0,0.03)" }}>
       

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("dashboard")}
                selected={currentTab === "dashboard"}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: currentTab === "dashboard" ? "#FFF5F0" : "transparent",
                  color: currentTab === "dashboard" ? "#F97316" : "#64748B",
                  "&.Mui-selected": { bgcolor: "#FFF5F0", color: "#F97316" },
                  "&:hover": { bgcolor: "#FFF5F0" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "dashboard" ? "#F97316" : "#94A3B8" }}>
                  <HomeIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: currentTab === "dashboard" ? "bold" : "500" }} />
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
                  bgcolor: currentTab === "users" ? "#FFF5F0" : "transparent",
                  color: currentTab === "users" ? "#F97316" : "#64748B",
                  "&.Mui-selected": { bgcolor: "#FFF5F0", color: "#F97316" },
                  "&:hover": { bgcolor: "#FFF5F0" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentTab === "users" ? "#F97316" : "#94A3B8" }}>
                  <PeopleIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Users" primaryTypographyProps={{ fontWeight: currentTab === "users" ? "bold" : "500" }} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "#94A3B8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              System Mocks
            </Typography>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <MusicNoteIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Songs" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <MicIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Manage Artists" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <AssessmentIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Reports" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "#94A3B8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
              Account
            </Typography>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}>
                  <ExitToAppIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, pb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1E293B" }}>
                  Admin Dashboard 
                </Typography>
                <Typography variant="body1" sx={{ color: "#94A3B8", mt: 0.5 }}>
                  Manage users, update statuses, and monitor system parameters.
                </Typography>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </Alert>
          )}

          {/* Dashboard Tab */}
          {currentTab === "dashboard" && (
            <Box>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Total Users
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#1E293B" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : totalUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Artists Register
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#E91E63" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : artistsCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Listeners Register
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#6366F1" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : listenersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                        Active Statuses
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: "#00BCD4" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : activeUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)", transform: "translateY(-2px)" } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1E293B" }}>
                  Registered Users
                </Typography>
                <Button onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold", color: "#F97316", "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                  View All Users →
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column" }}>
                {loading ? (
                  <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : users.length === 0 ? (
                  <Typography sx={{ p: 4, color: "#94A3B8", textAlign: "center" }}>No registered users found.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#FFF8F5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 5).map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "#FFF8F5 !important" } }}>
                          <TableCell sx={{ fontWeight: "600", color: "#1E293B" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "#94A3B8" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: "0.75rem", fontWeight: "medium", color: "#64748B" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? "#ECFDF5" : "#FEF2F2", border: user.status === "Active" ? "1px solid #A7F3D0" : "1px solid #FECACA", color: user.status === "Active" ? "#059669" : "#DC2626", fontSize: "0.75rem", fontWeight: "bold" }}>
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
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "#FFFFFF", borderRadius: 3, px: 2, border: "1px solid #FFF0E6", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <SearchIcon sx={{ color: "#94A3B8", mr: 1.5 }} />
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
                  <Select
                    labelId="role-select-label"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Role"
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                    <MenuItem value="Artist">Artist</MenuItem>
                    <MenuItem value="Listener">Listener</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column" }}>
                {loading ? (
                  <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Typography sx={{ p: 6, color: "#94A3B8", textAlign: "center" }}>No users match your criteria.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#FFF8F5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "#FFF8F5 !important" } }}>
                          <TableCell sx={{ fontWeight: "600", color: "#1E293B" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "#94A3B8" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: "0.75rem", fontWeight: "medium", color: "#64748B" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? "#ECFDF5" : "#FEF2F2", border: user.status === "Active" ? "1px solid #A7F3D0" : "1px solid #FECACA", color: user.status === "Active" ? "#059669" : "#DC2626", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {user.status || "Active"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<InfoIcon />}
                                onClick={() => setSelectedUser(user)}
                                sx={{ textTransform: "none", borderRadius: 2, borderColor: "#E2E8F0", color: "#64748B", "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: "#FFF5F0" } }}
                              >
                                Details
                              </Button>
                              <Button
                                variant="outlined"
                                color={user.status === "Inactive" ? "primary" : "error"}
                                size="small"
                                onClick={() => toggleUserStatus(user.user_id, user.status || "Active")}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                              >
                                {user.status === "Inactive" ? "Activate" : "Deactivate"}
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

      {/* Details View Modal */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #FFF0E6", minWidth: 400 },
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid #F1F5F9", color: "#1E293B" }}>
              User Metadata Details
              <IconButton
                onClick={() => setSelectedUser(null)}
                sx={{ position: "absolute", right: 16, top: 16, color: "#94A3B8" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>User ID</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#1E293B" }}>{selectedUser.user_id}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>Username</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#1E293B" }}>{selectedUser.username || "N/A"}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>Email Address</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#1E293B" }}>{selectedUser.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>System Role</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#F97316" }}>{selectedUser.role_name}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>Status</Typography>
                <Typography sx={{ fontWeight: "bold", color: selectedUser.status === "Inactive" ? "#DC2626" : "#059669" }}>
                  {selectedUser.status || "Active"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>Joined Date</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#1E293B" }}>
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", pb: 1 }}>
                <Typography sx={{ color: "#94A3B8" }}>Home Address</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#1E293B" }}>{selectedUser.address || "Not Provided"}</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9" }}>
              <Button
                variant="contained"
                fullWidth
                color={selectedUser.status === "Inactive" ? "primary" : "error"}
                onClick={() => toggleUserStatus(selectedUser.user_id, selectedUser.status || "Active")}
                sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}
              >
                {selectedUser.status === "Inactive" ? "Activate Account" : "Deactivate Account"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}