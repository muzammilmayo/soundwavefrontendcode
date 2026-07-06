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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1db954",
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
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

  // Toggle user status
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

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role_name === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics (Super Admins are already excluded by the backend)
  const totalUsersCount = users.length;
  const artistsCount = users.filter((u) => u.role_name === "Artist").length;
  const listenersCount = users.filter((u) => u.role_name === "Listener").length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
const inactiveUsersCount = users.filter((u) => u.status === "Inactive").length;
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        
        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "black", p: 3, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 5,
              cursor: "pointer",
              letterSpacing: -1,
            }}
            onClick={() => setCurrentTab("dashboard")}
          >
            SoundWave
          </Typography>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("dashboard")}
                selected={currentTab === "dashboard"}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": { bgcolor: "rgba(29, 185, 84, 0.15)", color: "#1db954" },
                }}
              >
                <ListItemIcon sx={{ color: currentTab === "dashboard" ? "primary.main" : "text.secondary" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCurrentTab("users")}
                selected={currentTab === "users"}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": { bgcolor: "rgba(29, 185, 84, 0.15)", color: "#1db954" },
                }}
              >
                <ListItemIcon sx={{ color: currentTab === "users" ? "primary.main" : "text.secondary" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>
              System Mocks
            </Typography>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled>
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Songs" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled>
                <ListItemIcon>
                  <MicIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Artists" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>
              Account
            </Typography>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "error.main" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Admin Dashboard 🛡️
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Manage users, update statuses, and monitor system parameters.
              </Typography>
            </Box>
            {/* <Button
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              sx={{ borderRadius: 3, textTransform: "none", borderColor: "rgba(0,0,0,0.2)" }}
            >
              Sync Data
            </Button> */}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {/* Dashboard Tab */}
          {currentTab === "dashboard" && (
         <Box>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>
                        Total Users
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : totalUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>
                        Artists Register
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold",  mt: 1, color: "secondary.main" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : artistsCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>
                        Listeners Register
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, color: "info.main" }}>
                 {loading ? <CircularProgress size={30} color="inherit" /> : listenersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>
                        Active Statuses
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : activeUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>
                        InActive Statuses
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, color: "error.main" }}>
                        {loading ? <CircularProgress size={30} color="inherit" /> : inactiveUsersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Users List */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Registered Users
                </Typography>
                <Button color="primary" onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold" }}>
                  View All Users →
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                {loading ? (
                  <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : users.length === 0 ? (
                  <Typography sx={{ p: 4, color: "text.secondary", textAlign: "center" }}>No registered users found.</Typography>
                ) : (
                  <Table>
                    <TableHead sx={{ bgcolor: "#282828" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 5).map((user) => (
                        <TableRow key={user.user_id} hover>
                          <TableCell sx={{ fontWeight: "600" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.75rem", fontWeight: "medium" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? "rgba(46, 125, 50, 0.1)" : "rgba(211, 47, 47, 0.1)", border: user.status === "Active" ? "1px solid rgba(46, 125, 50, 0.2)" : "1px solid rgba(211, 47, 47, 0.2)", color: user.status === "Active" ? "primary.main" : "error.main", fontSize: "0.75rem", fontWeight: "bold" }}>
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
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
                  <TextField
                    variant="standard"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    InputProps={{ disableUnderline: true }}
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
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                {loading ? (
                  <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No users match your criteria.</Typography>
                ) : (
                  <Table>
                    <TableHead sx={{ bgcolor: "#282828" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id} hover>
                          <TableCell sx={{ fontWeight: "600" }}>{user.username}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.75rem", fontWeight: "medium" }}>
                              {user.role_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: user.status === "Active" ? "rgba(46, 125, 50, 0.1)" : "rgba(211, 47, 47, 0.1)", border: user.status === "Active" ? "1px solid rgba(46, 125, 50, 0.2)" : "1px solid rgba(211, 47, 47, 0.2)", color: user.status === "Active" ? "primary.main" : "error.main", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {user.status || "Active"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<InfoIcon />}
                                onClick={() => setSelectedUser(user)}
                                sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(255,255,255,0.2)" }}
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
          sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(255,255,255,0.08)", minWidth: 400 },
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              User Metadata Details
              <IconButton
                onClick={() => setSelectedUser(null)}
                sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>User ID</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{selectedUser.user_id}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>Username</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{selectedUser.username || "N/A"}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>Email Address</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{selectedUser.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>System Role</Typography>
                <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>{selectedUser.role_name}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>Status</Typography>
                <Typography sx={{ fontWeight: "bold", color: selectedUser.status === "Inactive" ? "error.main" : "primary.main" }}>
                  {selectedUser.status || "Active"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", pb: 1 }}>
                <Typography sx={{ color: "text.secondary" }}>Joined Date</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
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
                <Typography sx={{ color: "text.secondary" }}>Home Address</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{selectedUser.address || "Not Provided"}</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
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
          sx={{ width: "100%", borderRadius: 3 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}