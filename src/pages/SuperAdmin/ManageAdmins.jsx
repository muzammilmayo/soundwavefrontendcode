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

import { UserCheck, UserMinus } from "lucide-react";
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

export default function ManageAdmins() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [adminSearch, setAdminSearch] = useState("");
  const [nonAdminSearch, setNonAdminSearch] = useState("");

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

  const nonAdminsList = users.filter((u) => {
    const isNotAdmin = u.role_name !== "Admin" && u.role_name !== "Super Admin";
    const matchesSearch =
      u.username.toLowerCase().includes(nonAdminSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(nonAdminSearch.toLowerCase());
    return isNotAdmin && matchesSearch;
  });

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFF5F0" }}>

        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "#FFFFFF", p: 3, display: "flex", flexDirection: "column", boxShadow: "0 0 20px rgba(0,0,0,0.03)" }}>
        

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "dashboard" } })}
                sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <HomeIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Dashboard
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/dashboard", { state: { tab: "users" } })}
                sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <PeopleIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Manage Users
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/SuperAdmin/admins")}
                selected
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  bgcolor: "#FFF5F0",
                  color: "#F97316",
                  "&.Mui-selected": { bgcolor: "#FFF5F0", color: "#F97316" },
                  "&:hover": { bgcolor: "#FFF5F0" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#F97316" }}>
                  <ShieldIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: "bold" }}>
                      Manage Admins
                    </Typography>
                  } 
                />
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
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Manage Songs
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <MicIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Manage Artists
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ opacity: 0.4 }}>
              <ListItemButton disabled sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}>
                  <AssessmentIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Reports
                    </Typography>
                  } 
                />
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
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Profile
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}>
                  <ExitToAppIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>
                      Logout
                    </Typography>
                  } 
                />
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
                  Manage Admins 
                </Typography>
                <Typography variant="body1" sx={{ color: "#94A3B8", mt: 0.5 }}>
                  Create Admin and  demote Admins
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={openCreateDialog}
                  sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#F97316", boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
                >
                  Create Admin
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", borderColor: "#E2E8F0", color: "#64748B", "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: "#FFF5F0" } }}
                >
                  Sync Data
                </Button>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </Alert>
          )}

          {/* List of Admins */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1E293B" }}>
              System Admins
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#FFFFFF", borderRadius: 3, px: 2, border: "1px solid #FFF0E6", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", width: 260 }}>
              <SearchIcon sx={{ color: "#94A3B8", mr: 1, fontSize: 18 }} />
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

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF" }}>
            {loading ? (
              <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : adminsList.length === 0 ? (
              <Typography sx={{ p: 6, color: "#94A3B8", textAlign: "center" }}>No Admins match filter.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#FFF8F5" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminsList.map((user) => (
                    <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "#FFF8F5 !important" } }}>
                      <TableCell sx={{ fontWeight: "600", color: "#1E293B" }}>{user.username}</TableCell>
                      <TableCell sx={{ color: "#94A3B8" }}>{user.email}</TableCell>
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
          sx: { borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #FFF0E6", minWidth: 400 },
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid #F1F5F9", color: "#1E293B" }}>
              Admin Metadata Details
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
            <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: 1.5 }}>
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

      {/* Create Admin Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #FFF0E6", minWidth: 440 },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid #F1F5F9", color: "#1E293B" }}>
          Create New Admin Account
          <IconButton
            onClick={() => setCreateDialogOpen(false)}
            sx={{ position: "absolute", right: 16, top: 16, color: "#94A3B8" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          <TextField
            label="Username"
            type="text"
            value={createForm.username}
            onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
            fullWidth
            required
            variant="outlined"
            autoFocus
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <TextField
            label="Email Address"
            type="email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            fullWidth
            required
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <TextField
            label="Temporary Password"
            type="text"
            value={createForm.password}
            fullWidth
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, "& .MuiInputBase-input": { fontFamily: "monospace", letterSpacing: 1 } }}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(createForm.password)} title="Copy Password" sx={{ color: "#94A3B8" }}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setCreateForm({ ...createForm, password: generatePassword() })} title="Generate New Password" sx={{ color: "#94A3B8" }}>
                      <AutorenewIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Alert severity="info" sx={{ borderRadius: 2, bgcolor: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE" }}>
            The temporary password is auto-generated. Share it securely with the new admin. They should change it after their first login.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => setCreateDialogOpen(false)}
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", borderColor: "#E2E8F0", color: "#64748B", px: 3, py: 1, "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: "#FFF5F0" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateAdmin}
            disabled={createLoading}
            startIcon={createLoading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#F97316", px: 3, py: 1, boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
          >
            {createLoading ? "Creating..." : "Create Admin"}
          </Button>
        </DialogActions>
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