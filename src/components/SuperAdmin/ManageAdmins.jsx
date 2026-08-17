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
  InputAdornment,
  Chip,
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
  PersonAdd as PersonAddIcon,
  Autorenew as AutorenewIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";

import { UserMinus } from "lucide-react";
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

export default function ManageAdmins() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [adminSearch, setAdminSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ username: "", email: "", password: "" });
  const [createLoading, setCreateLoading] = useState(false);

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const all = upper + lower + digits + special;
    let pwd = "";
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += digits[Math.floor(Math.random() * digits.length)];
    pwd += special[Math.floor(Math.random() * special.length)];
    for (let i = 4; i < 16; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    pwd = pwd.split("").sort(() => Math.random() - 0.5).join("");
    return pwd;
  };

  const openCreateDialog = () => {
    setCreateForm({ username: "", email: "", password: generatePassword() });
    setCreateDialogOpen(true);
  };

  const handleCreateAdmin = async () => {
    if (!createForm.username.trim()) {
      showToast("Username is required", "error");
      return;
    }
    if (!createForm.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      showToast("Please provide a valid email address", "error");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await api.post("/superadmin/users", {
        username: createForm.username,
        email: createForm.email,
        password: createForm.password,
      });
      showToast(res.data.message || "Admin account created successfully", "success");
      setCreateDialogOpen(false);
      setCreateForm({ username: "", email: "", password: "" });
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create admin account";
      showToast(msg, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Password copied to clipboard", "success");
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

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "rgba(255, 255, 255, 0.02)",
      "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
      "&:hover fieldset": { borderColor: "#01F2EA" },
      "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>

        {/* Sidebar Left Navigation Panel */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)", position: "fixed", top: "64px", left: 0, bottom: 0, height: "calc(100vh - 64px)", zIndex: 1100 }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "dashboard" } })}
                sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <HomeIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Dashboard</Typography>} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "users" } })}
                sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <PeopleIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Manage Users</Typography>} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/admins")}
                selected
                sx={{
                  borderRadius: 3,
                  py: 0.6,
                  px: 2,
                  bgcolor: "rgba(1, 242, 234, 0.08)",
                  color: "#01F2EA",
                  "&.Mui-selected": { bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#01F2EA" }}>
                  <ShieldIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: "bold" }}>Manage Admins</Typography>} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />
            <Typography variant="caption" sx={{ px: 2, mb: 0.5, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, fontSize: "0.7rem" }}>
              System Mocks
            </Typography>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "songs" } })}
                sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <MusicNoteIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Manage Songs</Typography>} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "artists" } })}
                sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <MicIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Manage Artists</Typography>} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "reports" } })}
                sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <AssessmentIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Reports</Typography>} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />
            <Typography variant="caption" sx={{ px: 2, mb: 0.5, color: "text.secondary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, fontSize: "0.7rem" }}>
              Account
            </Typography>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Profile</Typography>} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 32, color: "#EF4444" }}>
                  <ExitToAppIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#EF4444" }}>Logout</Typography>} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Workspace Content Space */}
        <Box sx={{ flexGrow: 1, ml: "260px", p: 5, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>

          <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                  Manage Admins 🛡️
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  Create Admin and demote Admins
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={openCreateDialog}
                  sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", boxShadow: "0 4px 14px rgba(1,242,234,0.3)", "&:hover": { bgcolor: "#00DDD5" } }}
                >
                  Create Admin
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", borderColor: "rgba(162,160,213,0.3)", color: "#A2A0D5", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA", bgcolor: "rgba(1, 242, 234, 0.05)" } }}
                >
                  Sync Data
                </Button>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </Alert>
          )}

          {/* List of Admins Workspace Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              System Admins
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, border: "1px solid rgba(162, 160, 213, 0.2)", width: 260, "&:focus-within": { borderColor: "#01F2EA" } }}>
              <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 18 }} />
              <input
                type="text"
                placeholder="Filter Admins list..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: "#FFFFFF", width: "100%", padding: "10px 0", fontSize: 14 }}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            {loading ? (
              <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : adminsList.length === 0 ? (
              <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No Admins match filter.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminsList.map((user) => (
                    <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                      <TableCell sx={{ fontWeight: "600", color: "#FFFFFF" }}>{user.username}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.status || "Active"} size="small" variant="outlined" color={user.status === "Inactive" ? "error" : "success"} sx={{ fontWeight: "bold", borderRadius: 2 }} />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<InfoIcon />}
                            onClick={() => setSelectedUser(user)}
                            sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(162,160,213,0.3)", color: "#A2A0D5", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}
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
                            color="secondary"
                            size="small"
                            startIcon={<UserMinus size={16} />}
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

      {/* Details View Modal Panel */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162, 160, 213, 0.2)", minWidth: 400 },
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", color: "#FFFFFF" }}>
              Admin Metadata Details
              <IconButton onClick={() => setSelectedUser(null)} sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "User ID", val: selectedUser.user_id, color: "#FFFFFF" },
                { label: "Username", val: selectedUser.username || "N/A", color: "#FFFFFF" },
                { label: "Email Address", val: selectedUser.email, color: "#FFFFFF" },
                { label: "System Role", val: selectedUser.role_name, color: "#01F2EA" },
                { label: "Status", val: selectedUser.status || "Active", color: selectedUser.status === "Inactive" ? "#EF4444" : "#10B981" },
                { label: "Joined Date", val: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "N/A", color: "#FFFFFF" },
                { label: "Home Address", val: selectedUser.address || "Not Provided", color: "#FFFFFF" },
              ].map((row, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(162, 160, 213, 0.1)", pb: 1 }}>
                  <Typography sx={{ color: "text.secondary" }}>{row.label}</Typography>
                  <Typography sx={{ fontWeight: "bold", color: row.color }}>{row.val}</Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(162, 160, 213, 0.15)", display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                color="secondary"
                onClick={() => updateUserRole(selectedUser.user_id, 5, "demote")}
                sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", m: "0 !important", borderColor: "#CE04F2", color: "#CE04F2" }}
              >
                Remove Admin Role (Demote)
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Admin Dialog Frame */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162, 160, 213, 0.2)", minWidth: 440 },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", color: "#FFFFFF" }}>
          Create New Admin Account
          <IconButton onClick={() => setCreateDialogOpen(false)} sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          <TextField fullWidth label="Username" type="text" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} required variant="outlined" autoFocus sx={textFieldStyles} />
          <TextField fullWidth label="Email Address" type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required variant="outlined" sx={textFieldStyles} />

          <TextField
            fullWidth
            label="Temporary Password"
            type="text"
            value={createForm.password}
            variant="outlined"
            sx={{ ...textFieldStyles, "& .MuiInputBase-input": { fontFamily: "monospace", letterSpacing: 1 } }}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(createForm.password)} title="Copy Password" sx={{ color: "text.secondary" }}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setCreateForm({ ...createForm, password: generatePassword() })} title="Generate New Password" sx={{ color: "text.secondary" }}>
                      <AutorenewIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Alert severity="info" sx={{ borderRadius: 2, bgcolor: "rgba(1, 242, 234, 0.05)", color: "#01F2EA", border: "1px solid rgba(1, 242, 234, 0.2)" }}>
            The temporary password is auto-generated. Share it securely with the new admin. They should change it after their first login.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(162, 160, 213, 0.15)", gap: 1.5 }}>
          <Button variant="outlined" onClick={() => setCreateDialogOpen(false)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", borderColor: "rgba(162, 160, 213, 0.3)", color: "text.secondary", px: 3, py: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateAdmin}
            disabled={createLoading}
            startIcon={createLoading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", px: 3, py: 1, boxShadow: "0 4px 14px rgba(1,242,234,0.3)", "&:hover": { bgcolor: "#00DDD5" } }}
          >
            {createLoading ? "Creating..." : "Create Admin"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Styled Response Feedback Toast Alerts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}