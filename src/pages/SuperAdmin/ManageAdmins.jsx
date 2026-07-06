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
  Card,
  CardContent,
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
  Shield as ShieldIcon,
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

import { UserCheck, UserMinus } from "lucide-react";
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

export default function ManageAdmins() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [adminSearch, setAdminSearch] = useState("");
  const [nonAdminSearch, setNonAdminSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

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

  const updateUserRole = async (userId, newRoleId, actionName) => {
    try {
      const res = await api.put(`/superadmin/users/${userId}/role`, { role_id: newRoleId });
      showToast(res.data.message, "success");
      await fetchUsers();
      if (selectedUser && selectedUser.user_id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${actionName} user`;
      showToast(msg, "error");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const adminsList = users.filter((u) => {
    const isAdmin = u.role_name === "Admin";
    const matchesSearch =
      u.username.toLowerCase().includes(adminSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(adminSearch.toLowerCase());
    return isAdmin && matchesSearch;
  });

  const nonAdminsList = users.filter((u) => {
    const isNotAdmin = u.role_name !== "Admin" && u.role_name !== "Super Admin";
    const matchesSearch =
      u.username.toLowerCase().includes(nonAdminSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(nonAdminSearch.toLowerCase());
    return isNotAdmin && matchesSearch;
  });

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
            onClick={() => navigate("/SuperAdmin/dashboard")}
          >
            SoundWave
          </Typography>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "dashboard" } })}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ color: "text.secondary" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "users" } })}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ color: "text.secondary" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/admins")}
                selected
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": { bgcolor: "rgba(29, 185, 84, 0.15)", color: "primary.main" },
                }}
              >
                <ListItemIcon sx={{ color: "primary.main" }}>
                  <ShieldIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Admins" />
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
                Manage Admins 🛡️
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Promote users to Admin, demote Admins, and manage Admin account status.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              sx={{ borderRadius: 3, textTransform: "none", borderColor: "rgba(255,255,255,0.2)" }}
            >
              Sync Data
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {/* Promote User Card */}
          <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", mb: 5, bgcolor: "background.paper" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Promote User to Admin
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.default", borderRadius: 3, px: 2, border: "1px solid rgba(255,255,255,0.08)", mb: 3 }}>
                <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
                <TextField
                  variant="standard"
                  placeholder="Search registered Listeners, Artists, or Moderators to promote..."
                  value={nonAdminSearch}
                  onChange={(e) => setNonAdminSearch(e.target.value)}
                  fullWidth
                  slotProps={{ input: { disableUnderline: true } }}
                  sx={{ py: 1 }}
                />
              </Box>

              <TableContainer sx={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, maxHeight: 260 }}>
                {loading ? (
                  <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : nonAdminsList.length === 0 ? (
                  <Typography sx={{ p: 4, color: "text.secondary", textAlign: "center" }}>No matching non-Admins found.</Typography>
                ) : (
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#252525" }}>
                      <TableRow>
                        <TableCell sx={{ color: "#b3b3b3", fontWeight: "bold" }}>Username</TableCell>
                        <TableCell sx={{ color: "#b3b3b3", fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ color: "#b3b3b3", fontWeight: "bold" }}>Current Role</TableCell>
                        <TableCell sx={{ color: "#b3b3b3", fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nonAdminsList.slice(0, 10).map((u) => (
                        <TableRow key={u.user_id} hover>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "600" }}>{u.username}</TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "text.secondary" }}>{u.email}</TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <Box sx={{ display: "inline-block", px: 1, py: 0.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.7rem" }}>
                              {u.role_name}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<UserCheck />}
                              onClick={() => updateUserRole(u.user_id, 2, "promote")}
                              sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold" }}
                            >
                              Promote to Admin
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </CardContent>
          </Card>

          {/* List of Admins */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              System Admins
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, border: "1px solid rgba(255,255,255,0.08)", width: 260 }}>
              <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 18 }} />
              <TextField
                variant="standard"
                placeholder="Filter Admins list..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                slotProps={{ input: { disableUnderline: true } }}
                sx={{ py: 0.5, fontSize: "0.85rem" }}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
            {loading ? (
              <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : adminsList.length === 0 ? (
              <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No Admins match filter.</Typography>
            ) : (
              <Table>
                <TableHead sx={{ bgcolor: "#282828" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminsList.map((user) => (
                    <TableRow key={user.user_id} hover>
                      <TableCell sx={{ fontWeight: "600" }}>{user.username}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
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
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            startIcon={<UserMinus />}
                            onClick={() => updateUserRole(user.user_id, 5, "demote")}
                            sx={{ textTransform: "none", borderRadius: 2 }}
                          >
                            Demote
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
              Admin Metadata Details
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
            <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                color={selectedUser.status === "Inactive" ? "primary" : "error"}
                onClick={() => toggleUserStatus(selectedUser.user_id, selectedUser.status || "Active")}
                sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", m: "0 !important" }}
              >
                {selectedUser.status === "Inactive" ? "Activate Account" : "Deactivate Account"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="warning"
                onClick={() => updateUserRole(selectedUser.user_id, 5, "demote")}
                sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", m: "0 !important" }}
              >
                Remove Admin Role (Demote)
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