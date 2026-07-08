import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  DeleteForever as DeleteForeverIcon,
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import api from "../api";
import authService from "../services/authService";

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

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    address: "",
    avatar: "",
    phone: "",
    created_at: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, confirmText: "" });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setProfile({
        username: res.data.user.username || "",
        email: res.data.user.email || "",
        role: res.data.user.role || "",
        address: res.data.user.address || "",
        avatar: res.data.user.avatar || "",
        phone: res.data.user.phone || "",
        created_at: res.data.user.created_at || "",
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Failed to load profile:", err);
      const cached = localStorage.getItem("user");
      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile({
          username: parsed.username || "",
          email: parsed.email || "",
          role: parsed.role || "",
          address: parsed.address || "",
          avatar: parsed.avatar || "",
          phone: parsed.phone || "",
          created_at: parsed.created_at || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "success" });
    try {
      const res = await api.put("/auth/profile", {
        username: profile.username,
        address: profile.address,
        phone: profile.phone,
        avatar: profile.avatar,
      });
      const msg = res.data.message || "Profile saved successfully";
      showToast(msg, "success");
      setMessage({ text: msg, type: "success" });
      setProfile(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save profile";
      showToast(msg, "error");
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "success" });
    try {
      const res = await authService.changePassword(passwordForm);
      const msg = res.message || "Password updated successfully";
      showToast(msg, "success");
      setMessage({ text: msg, type: "success" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password";
      showToast(msg, "error");
      setMessage({ text: msg, type: "error" });
    }
  };

  const goBackToDashboard = () => {
    const role = profile.role;
    if (role === "Super Admin") {
      navigate("/SuperAdmin/dashboard");
    } else if (role === "Admin") {
      navigate("/Admin/dashboard");
    } else if (role === "Moderator") {
      navigate("/Moderator/dashboard");
    } else if (role === "Artist") {
      navigate("/artist/dashboard");
    } else if (role === "Listener") {
      navigate("/listener/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm.confirmText !== profile.username) {
      showToast("Username does not match. Please try again.", "error");
      return;
    }
    try {
      await api.delete("/auth/account");
      authService.logout();
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete account";
      showToast(msg, "error");
      setDeleteConfirm({ open: false, confirmText: "" });
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 3,
          bgcolor: "#FFF5F0",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBackToDashboard}
          sx={{ mb: 4, borderRadius: 3, textTransform: "none", fontWeight: "bold", borderColor: "#E2E8F0", color: "#64748B", px: 3, py: 1, "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: "#FFF5F0" } }}
        >
          Back to Dashboard
        </Button>

        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            border: "1px solid #FFF0E6",
            bgcolor: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            p: 2,
          }}
        >
          <CardContent>
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3, color: "#1E293B" }}>
              🎵 SoundWave Profile
            </Typography>

            {message.text && (
              <Alert severity={message.type} sx={{ mb: 3, borderRadius: 3, bgcolor: message.type === "success" ? "#ECFDF5" : "#FEF2F2", color: message.type === "success" ? "#059669" : "#DC2626", border: message.type === "success" ? "1px solid #A7F3D0" : "1px solid #FECACA" }}>
                {message.text}
              </Alert>
            )}

            <Tabs
              value={activeTab}
              onChange={(e, val) => {
                setActiveTab(val);
                setMessage({ text: "", type: "success" });
              }}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{ borderBottom: "1px solid #FFF0E6", mb: 3 }}
            >
              <Tab icon={<PersonIcon />} label="My Profile" sx={{ textTransform: "none", fontWeight: "bold", color: "#64748B" }} />
              <Tab icon={<LockIcon />} label="Security" sx={{ textTransform: "none", fontWeight: "bold", color: "#64748B" }} />
              <Tab icon={<DeleteForeverIcon />} label="Danger Zone" sx={{ textTransform: "none", fontWeight: "bold", color: activeTab === 2 ? "#DC2626" : "#64748B" }} />
            </Tabs>

            {/* Tab 0: Profile form */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={saveProfile} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Username"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  fullWidth
                  required
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="Email (Read Only)"
                  value={profile.email}
                  fullWidth
                  disabled
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, "& .Mui-disabled": { color: "#94A3B8", bgcolor: "#F8FAFC" } }}
                />

                <TextField
                  label="Home Address"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="Avatar Image URL"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, px: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                    Role: <strong style={{ color: "#1E293B" }}>{profile.role}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                    Joined: <strong style={{ color: "#1E293B" }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</strong>
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1, bgcolor: "#F97316", boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Save Profile"}
                </Button>
              </Box>
            )}

            {/* Tab 1: Password Form */}
            {activeTab === 1 && (
              <Box component="form" onSubmit={changePassword} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1, bgcolor: "#F97316", boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
                >
                  Update Password
                </Button>
              </Box>
            )}

            {/* Tab 2: Danger Zone */}
            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Alert severity="error" sx={{ borderRadius: 2, bgcolor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  Deleting your account is <strong>permanent and irreversible</strong>. All your data will be removed from the system.
                </Alert>

                <Box sx={{ bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 3, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <WarningAmberIcon sx={{ color: "#DC2626" }} />
                    <Typography sx={{ fontWeight: "bold", color: "#DC2626" }}>Delete My Account</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
                    Once deleted, your account (<strong style={{ color: "#1E293B" }}>{profile.email}</strong>) cannot be recovered.
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => setDeleteConfirm({ open: true, confirmText: "" })}
                    sx={{ borderRadius: 3, py: 1.2, textTransform: "none", fontWeight: "bold" }}
                  >
                    Delete My Account Permanently
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, confirmText: "" })}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #FECACA", minWidth: 420 },
        }}
      >
        <DialogTitle sx={{ p: 3, fontWeight: "bold", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1, color: "#1E293B" }}>
          <WarningAmberIcon sx={{ color: "#DC2626" }} />
          Confirm Account Deletion
          <IconButton
            onClick={() => setDeleteConfirm({ open: false, confirmText: "" })}
            sx={{ position: "absolute", right: 16, top: 16, color: "#94A3B8" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3, bgcolor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
            This will <strong>permanently delete</strong> your account and all associated data. This cannot be undone.
          </Alert>
          <Typography variant="body2" sx={{ color: "#94A3B8", mb: 1 }}>
            To confirm, type your username: <strong style={{ color: "#1E293B" }}>{profile.username}</strong>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={profile.username}
            value={deleteConfirm.confirmText}
            onChange={(e) => setDeleteConfirm({ ...deleteConfirm, confirmText: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5, borderTop: "1px solid #F1F5F9" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setDeleteConfirm({ open: false, confirmText: "" })}
            sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold", borderColor: "#E2E8F0", color: "#64748B", "&:hover": { borderColor: "#F97316", color: "#F97316", bgcolor: "#FFF5F0" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<DeleteForeverIcon />}
            disabled={deleteConfirm.confirmText !== profile.username}
            onClick={handleDeleteAccount}
            sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}
          >
            Delete My Account
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