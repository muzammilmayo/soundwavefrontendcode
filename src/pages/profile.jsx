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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import api from "../api";
import authService from "../services/authService";

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
    created_at: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

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

  return (
    <ThemeProvider theme={darkTheme}>
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
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={goBackToDashboard}
          sx={{ mb: 4, borderRadius: 3, textTransform: "none", fontWeight: "bold" }}
        >
          Back to Dashboard
        </Button>

        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <CardContent>
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
              🎵 SoundWave Profile
            </Typography>

            {message.text && (
              <Alert severity={message.type} sx={{ mb: 3, borderRadius: 3 }}>
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
              sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", mb: 3 }}
            >
              <Tab icon={<PersonIcon />} label="My Profile" sx={{ textTransform: "none", fontWeight: "bold" }} />
              <Tab icon={<LockIcon />} label="Security" sx={{ textTransform: "none", fontWeight: "bold" }} />
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
                />

                <TextField
                  label="Email (Read Only)"
                  value={profile.email}
                  fullWidth
                  disabled
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                  label="Home Address"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                  label="Avatar Image URL"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, px: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Role: <strong style={{ color: "#fff" }}>{profile.role}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Joined: <strong style={{ color: "#fff" }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</strong>
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1 }}
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
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1 }}
                >
                  Update Password
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

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