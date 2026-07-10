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
  TextField,
  Snackbar,
  Grid,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  MusicNote as MusicNoteIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Lock as LockIcon,
  DeleteForever as DeleteForeverIcon,
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F97316" }, // Artist theme color
    background: { default: "#FFF5F0", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#94A3B8" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ArtistProfilePage() {
  const navigate = useNavigate();
  const user = authService.getUser() || {};
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const [artistProfile, setArtistProfile] = useState({
    stage_name: "",
    bio: "",
    profile_image: "",
    cover_image: "",
    facebook: "",
    instagram: "",
    youtube: "",
    spotify: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, confirmText: "" });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchArtistProfile = async () => {
    if (!user.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/artist-profile/${user.id}`);
      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        setArtistProfile({
          stage_name: data.stage_name ?? "",
          bio: data.bio ?? "",
          profile_image: data.profile_image ?? "",
          cover_image: data.cover_image ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          spotify: data.spotify ?? "",
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to load artist profile:", err);
        showToast("Failed to load artist profile details", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setArtistProfile({
      ...artistProfile,
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
    if (!user.id) return;
    setLoading(true);
    setMessage({ text: "", type: "success" });
    try {
      const res = await api.post(`/artist-profile/${user.id}`, artistProfile);
      const msg = res.data?.message || "Artist profile saved successfully!";
      showToast(msg, "success");
      setMessage({ text: msg, type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save artist profile";
      showToast(msg, "error");
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm.confirmText !== user.username) {
      showToast("Username does not match. Please try again.", "error");
      return;
    }
    setLoading(true);
    try {
      await api.delete("/auth/account");
      authService.logout();
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete account";
      showToast(msg, "error");
      setDeleteConfirm({ open: false, confirmText: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/artist/dashboard")}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 3, textTransform: "none", color: "#F97316", borderColor: "#FFF0E6", bgcolor: "#FFFFFF", "&:hover": { bgcolor: "#FFF5F0", borderColor: "#F97316" } }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Artist Profile Setup 🎤
            </Typography>
          </Box>

          {/* Form Card */}
          <Card sx={{ borderRadius: 5, border: "1px solid #FFF0E6", boxShadow: "0 8px 30px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF", overflow: "visible" }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => {
                setActiveTab(val);
                setMessage({ text: "", type: "success" });
              }}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{ borderBottom: "1px solid #F1F5F9", "& .MuiTab-root": { py: 2, textTransform: "none", fontWeight: "bold" } }}
            >
              <Tab label="Artist Details" icon={<MusicNoteIcon />} iconPosition="start" />
              <Tab label="Change Password" icon={<LockIcon />} iconPosition="start" />
              <Tab label="Danger Zone" icon={<DeleteForeverIcon />} iconPosition="start" />
            </Tabs>

            <CardContent sx={{ p: { xs: 2, md: 5 } }}>
              {message.text && (
                <Alert severity={message.type} sx={{ mb: 4, borderRadius: 3 }}>
                  {message.text}
                </Alert>
              )}

              {/* Tab 0: Artist Profile Setup */}
              {activeTab === 0 && (
                <Box component="form" onSubmit={saveProfile}>
                  {/* Live Preview Header */}
                  <Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden", position: "relative", bgcolor: "#F1F5F9" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 180,
                        backgroundImage: artistProfile.cover_image ? `url(${artistProfile.cover_image})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        bgcolor: artistProfile.cover_image ? "transparent" : "#E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!artistProfile.cover_image && (
                        <Typography sx={{ color: "#94A3B8" }}>No cover image</Typography>
                      )}
                    </Box>
                    <Box sx={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "flex-end", gap: 2 }}>
                      <Avatar
                        src={artistProfile.profile_image || ""}
                        sx={{
                          width: 80,
                          height: 80,
                          border: "3px solid #FFFFFF",
                          bgcolor: "#E2E8F0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {!artistProfile.profile_image && <MusicNoteIcon sx={{ color: "#94A3B8", fontSize: 32 }} />}
                      </Avatar>
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: artistProfile.cover_image ? "#FFFFFF" : "#1E293B",
                            textShadow: artistProfile.cover_image ? "0 2px 8px rgba(0,0,0,0.6)" : "none",
                          }}
                        >
                          {artistProfile.stage_name || "Your Stage Name"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
                    Profile Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Stage Name"
                        name="stage_name"
                        placeholder="Your professional artist name"
                        value={artistProfile.stage_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Biography"
                        name="bio"
                        placeholder="Tell your fans about yourself, your music, and your background..."
                        value={artistProfile.bio}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Profile Image URL"
                        name="profile_image"
                        placeholder="https://example.com/profile.jpg"
                        value={artistProfile.profile_image}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Cover Image URL"
                        name="cover_image"
                        placeholder="https://example.com/cover.jpg"
                        value={artistProfile.cover_image}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4, borderColor: "rgba(0,0,0,0.06)" }} />

                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
                    Social Links
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Facebook URL"
                        name="facebook"
                        placeholder="https://facebook.com/..."
                        value={artistProfile.facebook}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{
                          input: {
                            startAdornment: <FacebookIcon sx={{ color: "#3B82F6", mr: 1 }} />,
                          },
                          inputLabel: { shrink: true }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Instagram URL"
                        name="instagram"
                        placeholder="https://instagram.com/..."
                        value={artistProfile.instagram}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{
                          input: {
                            startAdornment: <InstagramIcon sx={{ color: "#EC4899", mr: 1 }} />,
                          },
                          inputLabel: { shrink: true }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="YouTube URL"
                        name="youtube"
                        placeholder="https://youtube.com/..."
                        value={artistProfile.youtube}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{
                          input: {
                            startAdornment: <YouTubeIcon sx={{ color: "#EF4444", mr: 1 }} />,
                          },
                          inputLabel: { shrink: true }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Spotify Artist Link"
                        name="spotify"
                        placeholder="https://open.spotify.com/artist/..."
                        value={artistProfile.spotify}
                        onChange={handleChange}
                        disabled={loading}
                        slotProps={{
                          input: {
                            startAdornment: <MusicNoteIcon sx={{ color: "#1DB954", mr: 1 }} />,
                          },
                          inputLabel: { shrink: true }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: "bold",
                        bgcolor: "#F97316",
                        boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                        "&:hover": { bgcolor: "#EA580C" },
                      }}
                    >
                      Save Profile Settings
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Tab 1: Change Password */}
              {activeTab === 1 && (
                <Box component="form" onSubmit={changePassword} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    Change Password
                  </Typography>

                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: "bold",
                        bgcolor: "#F97316",
                        boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                        "&:hover": { bgcolor: "#EA580C" },
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Tab 2: Danger Zone */}
              {activeTab === 2 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#DC2626" }}>
                    Danger Zone
                  </Typography>

                  <Alert severity="error" sx={{ borderRadius: 2, bgcolor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                    Deleting your account is <strong>permanent and irreversible</strong>. All your uploaded music, profile data, and albums will be deleted.
                  </Alert>

                  <Box sx={{ bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 4, p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <WarningAmberIcon sx={{ color: "#DC2626" }} />
                      <Typography sx={{ fontWeight: "bold", color: "#DC2626" }}>Delete Account</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#94A3B8", mb: 3 }}>
                      Once deleted, your account (<strong style={{ color: "#1E293B" }}>{user.email}</strong>) cannot be recovered.
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => setDeleteConfirm({ open: true, confirmText: "" })}
                      sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold" }}
                    >
                      Delete My Account Permanently
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, confirmText: "" })}
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #FECACA", minWidth: 420 },
        }}
      >
        <DialogTitle sx={{ p: 3, fontWeight: "bold", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1, color: "#1E293B", position: "relative" }}>
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
            This will <strong>permanently delete</strong> your account and all associated songs and data. This cannot be undone.
          </Alert>
          <Typography variant="body2" sx={{ color: "#94A3B8", mb: 1 }}>
            To confirm, type your username: <strong style={{ color: "#1E293B" }}>{user.username}</strong>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={user.username}
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
            disabled={deleteConfirm.confirmText !== user.username}
            onClick={handleDeleteAccount}
            sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}
          >
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ borderRadius: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}