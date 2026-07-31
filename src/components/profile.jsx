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
  MusicNote as MusicIcon,
} from "@mui/icons-material";
import api from "../api";
import authService from "../services/authService";

// --- Custom Neon Dark Theme ---
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#01F2EA", // Neon Cyan
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#100B29", // Deep Purple
      paper: "#1A153A", // Purple Card
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A2A0D5", // Soft Lavender
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

const getUserRole = () => {
  const user = authService.getUser?.() || null;
  return user?.role || "";
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: getUserRole(),
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
      const user = res.data?.user || {};
      setProfile({
        username: user.username ?? "",
        email: user.email ?? "",
        role: user.role ?? getUserRole(),
        address: user.address ?? "",
        avatar: user.avatar ?? "",
        phone: user.phone ?? "",
        created_at: user.created_at ?? "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    if (role === "Artist") {
      navigate("/artist/profile", { replace: true });
    } else {
      fetchProfile();
    }
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
      const msg = res.data?.message || "Profile saved successfully";
      showToast(msg, "success");
      setMessage({ text: msg, type: "success" });
      const user = res.data?.user || {};
      setProfile({
        username: user.username ?? "",
        email: user.email ?? "",
        role: user.role ?? getUserRole(),
        address: user.address ?? "",
        avatar: user.avatar ?? "",
        phone: user.phone ?? "",
        created_at: user.created_at ?? "",
      });
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
      const msg = res?.message || "Password updated successfully";
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
    navigate(-1);
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

  // Input styling shortcut to remove boilerplate
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "rgba(255, 255, 255, 0.02)",
      "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
      "&:hover fieldset": { borderColor: "#01F2EA" },
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 3,
          bgcolor: "background.default",
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBackToDashboard}
          sx={{
            mb: 4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            borderColor: "rgba(162, 160, 213, 0.3)",
            color: "#A2A0D5",
            px: 3,
            py: 1,
            "&:hover": {
              borderColor: "#01F2EA",
              color: "#01F2EA",
              bgcolor: "rgba(1, 242, 234, 0.05)",
              boxShadow: "0 0 12px rgba(1, 242, 234, 0.2)",
            },
          }}
        >
          Back to Dashboard
        </Button>

        <Card
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 4,
            border: "1px solid rgba(162, 160, 213, 0.2)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            p: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
            >
              <MusicIcon sx={{ color: "#01F2EA", filter: "drop-shadow(0 0 4px #01F2EA)" }} />
              SoundWave Profile
            </Typography>

            {message.text && (
              <Alert
                severity={message.type}
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: message.type === "success" ? "#10B981" : "#EF4444",
                  border: message.type === "success" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
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
              sx={{
                borderBottom: "1px solid rgba(162, 160, 213, 0.15)",
                mb: 3,
                "& .MuiTabs-indicator": { bgcolor: activeTab === 2 ? "#EF4444" : "#01F2EA" },
              }}
            >
              <Tab icon={<PersonIcon />} label="My Profile" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
              <Tab icon={<LockIcon />} label="Security" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
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
                  sx={textFieldStyles}
                />

                <TextField
                  label="Email (Read Only)"
                  value={profile.email}
                  fullWidth
                  disabled
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    ...textFieldStyles,
                    "& .MuiOutlinedInput-root.Mui-disabled": {
                      bgcolor: "rgba(255, 255, 255, 0.01)",
                      "& fieldset": { borderColor: "rgba(162, 160, 213, 0.1)" },
                    },
                    "& .Mui-disabled": { color: "rgba(162, 160, 213, 0.4)", WebkitTextFillColor: "rgba(162, 160, 213, 0.4)" },
                  }}
                />

                <TextField
                  label="Home Address"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={textFieldStyles}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={textFieldStyles}
                />

                <TextField
                  label="Avatar Image URL"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={textFieldStyles}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, px: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Role: <strong style={{ color: "#CE04F2" }}>{profile.role || "Unknown"}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Joined: <strong style={{ color: "#FFFFFF" }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</strong>
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "bold",
                    mt: 1,
                    bgcolor: "#01F2EA",
                    color: "#100B29",
                    boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                    "&:hover": { bgcolor: "#00DDD5", boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)" },
                  }}
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
                  sx={textFieldStyles}
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
                  sx={textFieldStyles}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "bold",
                    mt: 1,
                    bgcolor: "#01F2EA",
                    color: "#100B29",
                    boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                    "&:hover": { bgcolor: "#00DDD5", boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)" },
                  }}
                >
                  Update Password
                </Button>
              </Box>
            )}

         
          </CardContent>
        </Card>
      </Box>

      {/* Delete Account Confirmation Dialog */}
   

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444",
            color: "#100B29",
            fontWeight: "bold",
            "& .MuiAlert-icon": { color: "#100B29" },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}