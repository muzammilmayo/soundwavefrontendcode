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
  Person as PersonIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";

// ===== HARDCODED NEON DARK THEME =====
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#01F2EA" }, // Neon Cyan
    secondary: { main: "#CE04F2" }, // Neon Magenta
    background: { default: "#100B29", paper: "#1A153A" }, // Deep Purple Palette
    text: { primary: "#FFFFFF", secondary: "#A2A0D5" }, // White and Soft Lavender
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
    artist_profile_id: "",
    stage_name: "",
    bio: "",
    profile_image: "",
    cover_image: "",
    facebook: "",
    instagram: "",
    youtube: "",
    spotify: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

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
          artist_profile_id: data.artist_profile_id ?? "",
          stage_name: data.stage_name ?? "",
          bio: data.bio ?? "",
          profile_image: data.profile_image ?? "",
          cover_image: data.cover_image ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          spotify: data.spotify ?? "",
        });
        setProfilePreview(data.profile_image ?? "");
        setCoverPreview(data.cover_image ?? "");
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

    const formData = new FormData();
    formData.append("stage_name", artistProfile.stage_name);
    formData.append("bio", artistProfile.bio);
    formData.append("facebook", artistProfile.facebook);
    formData.append("instagram", artistProfile.instagram);
    formData.append("youtube", artistProfile.youtube);
    formData.append("spotify", artistProfile.spotify);

    if (profileFile) {
      formData.append("profile_image", profileFile);
    } else {
      formData.append("profile_image", artistProfile.profile_image);
    }

    if (coverFile) {
      formData.append("cover_image", coverFile);
    } else {
      formData.append("cover_image", artistProfile.cover_image);
    }

    try {
      const res = await api.post(`/artist-profile/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const msg = res.data?.message || "Artist profile saved successfully!";
      showToast(msg, "success");
      setMessage({ text: msg, type: "success" });
      if (res.data?.data) {
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
        setProfilePreview(data.profile_image ?? "");
        setCoverPreview(data.cover_image ?? "");
        setProfileFile(null);
        setCoverFile(null);
      }
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

  const getFollowers = () => {
    if (!artistProfile.artist_profile_id) return [];
    const followers = [];
    const usersLookup = JSON.parse(localStorage.getItem("soundwave_users_lookup") || "{}");
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("soundwave_followed_artists_")) {
        const listenerId = key.replace("soundwave_followed_artists_", "");
        if (listenerId === "undefined") continue;
        try {
          const followedList = JSON.parse(localStorage.getItem(key)) || [];
          const isFollowing = followedList.some(
            (a) => Number(a.artist_profile_id) === Number(artistProfile.artist_profile_id)
          );
          if (isFollowing) {
            const listenerInfo = usersLookup[listenerId] || {
              username: `Listener #${listenerId}`,
              email: "N/A"
            };
            followers.push({
              id: listenerId,
              username: listenerInfo.username,
              email: listenerInfo.email,
            });
          }
        } catch (e) {
          console.error("Error parsing followed artists for key " + key, e);
        }
      }
    }
    return followers;
  };

  // Reusable styling parameters for dark synth inputs
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          {/* Header Dashboard section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/artist/dashboard")}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                color: "#A2A0D5",
                borderColor: "rgba(162, 160, 213, 0.3)",
                bgcolor: "transparent",
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
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Artist Profile Setup 🎤
            </Typography>
          </Box>

          {/* Form Card Configuration */}
          <Card
            sx={{
              borderRadius: 5,
              border: "1px solid rgba(162, 160, 213, 0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              bgcolor: "background.paper",
              overflow: "visible",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, val) => {
                setActiveTab(val);
                setMessage({ text: "", type: "success" });
              }}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                borderBottom: "1px solid rgba(162, 160, 213, 0.15)",
                "& .MuiTabs-indicator": { bgcolor: activeTab === 3 ? "#EF4444" : "#01F2EA" },
                "& .MuiTab-root": {
                  py: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#A2A0D5",
                  "&.Mui-selected": { color: activeTab === 3 ? "#EF4444" : "#01F2EA" },
                },
              }}
            >
              <Tab label="Artist Details" icon={<MusicNoteIcon />} iconPosition="start" />
              <Tab label="Followers" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Change Password" icon={<LockIcon />} iconPosition="start" />
              <Tab label="Danger Zone" icon={<DeleteForeverIcon />} iconPosition="start" />
            </Tabs>

            <CardContent sx={{ p: { xs: 2, md: 5 } }}>
              {message.text && (
                <Alert
                  severity={message.type}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: message.type === "success" ? "#10B981" : "#EF4444",
                    border: message.type === "success" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {message.text}
                </Alert>
              )}

              {/* Tab 0: Artist Profile Setup Workspace */}
              {activeTab === 0 && (
                <Box component="form" onSubmit={saveProfile}>
                  {/* Banner & Avatar Preview header Block */}
                  <Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden", position: "relative", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(162, 160, 213, 0.15)" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 180,
                        backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!coverPreview && (
                        <Typography sx={{ color: "text.secondary" }}>No cover image selected</Typography>
                      )}
                    </Box>
                    <Box sx={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "flex-end", gap: 2 }}>
                      <Avatar
                        src={profilePreview || ""}
                        sx={{
                          width: 80,
                          height: 80,
                          border: "3px solid #1A153A",
                          bgcolor: "rgba(255,255,255,0.05)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        {!profilePreview && <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 32 }} />}
                      </Avatar>
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#FFFFFF",
                            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                          }}
                        >
                          {artistProfile.stage_name || "Your Stage Name"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 3 }}>
                    Profile Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
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
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12}>
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
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1, color: "#FFFFFF" }}>
                        Profile Image
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: "none",
                          borderStyle: "dashed",
                          borderColor: "rgba(1, 242, 234, 0.4)",
                          color: "#01F2EA",
                          "&:hover": { bgcolor: "rgba(1, 242, 234, 0.05)", borderColor: "#01F2EA" },
                        }}
                      >
                        {profileFile ? profileFile.name : "Choose Profile Image"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setProfileFile(file);
                              setProfilePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1, color: "#FFFFFF" }}>
                        Cover Image
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: "none",
                          borderStyle: "dashed",
                          borderColor: "rgba(1, 242, 234, 0.4)",
                          color: "#01F2EA",
                          "&:hover": { bgcolor: "rgba(1, 242, 234, 0.05)", borderColor: "#01F2EA" },
                        }}
                      >
                        {coverFile ? coverFile.name : "Choose Cover Image"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setCoverFile(file);
                              setCoverPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4, borderColor: "rgba(162, 160, 213, 0.15)" }} />

                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 3 }}>
                    Social Links
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
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
                          inputLabel: { shrink: true },
                        }}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                          inputLabel: { shrink: true },
                        }}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                          inputLabel: { shrink: true },
                        }}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                          inputLabel: { shrink: true },
                        }}
                        sx={textFieldStyles}
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
                        bgcolor: "#01F2EA",
                        color: "#100B29",
                        boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                        "&:hover": { bgcolor: "#00DDD5", boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)" },
                      }}
                    >
                      Save Profile Settings
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Tab 1: Followers List Tab Panel */}
              {activeTab === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    My Followers 👥
                  </Typography>
                  {(() => {
                    const followers = getFollowers();
                    if (followers.length === 0) {
                      return (
                        <Card sx={{ p: 5, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
                          <Typography sx={{ color: "text.secondary" }}>You don't have any followers yet.</Typography>
                        </Card>
                      );
                    }
                    return (
                      <Grid container spacing={3}>
                        {followers.map((follower) => (
                          <Grid item xs={12} sm={6} key={follower.id}>
                            <Card sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                              <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#01F2EA", color: "#100B29", fontWeight: "bold" }}>
                                  {follower.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {follower.username}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {follower.email}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    );
                  })()}
                </Box>
              )}

              {/* Tab 2: Change Password workspace Form */}
              {activeTab === 2 && (
                <Box component="form" onSubmit={changePassword} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
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
                    sx={textFieldStyles}
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
                    sx={textFieldStyles}
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
                        bgcolor: "#01F2EA",
                        color: "#100B29",
                        boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                        "&:hover": { bgcolor: "#00DDD5" },
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Tab 3: Danger Zone Block Panel */}
              {activeTab === 3 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#EF4444" }}>
                    Danger Zone
                  </Typography>

                  <Alert severity="error" sx={{ borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    Deleting your account is <strong>permanent and irreversible</strong>. All your uploaded music, profile data, and albums will be deleted.
                  </Alert>

                  <Box sx={{ bgcolor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 4, p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <WarningAmberIcon sx={{ color: "#EF4444" }} />
                      <Typography sx={{ fontWeight: "bold", color: "#EF4444" }}>Delete Account</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                      Once deleted, your account (<strong style={{ color: "#FFFFFF" }}>{user.email}</strong>) cannot be recovered.
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => setDeleteConfirm({ open: true, confirmText: "" })}
                      sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)" }}
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
          sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(239, 68, 68, 0.3)", minWidth: 420 },
        }}
      >
        <DialogTitle sx={{ p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", display: "flex", alignItems: "center", gap: 1, color: "#FFFFFF", position: "relative" }}>
          <WarningAmberIcon sx={{ color: "#EF4444" }} />
          Confirm Account Deletion
          <IconButton
            onClick={() => setDeleteConfirm({ open: false, confirmText: "" })}
            sx={{ position: "absolute", right: 16, top: 16, color: "#A2A0D5" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            This will <strong>permanently delete</strong> your account and all associated songs and data. This cannot be undone.
          </Alert>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            To confirm, type your username: <strong style={{ color: "#FFFFFF" }}>{user.username}</strong>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={user.username}
            value={deleteConfirm.confirmText}
            onChange={(e) => setDeleteConfirm({ ...deleteConfirm, confirmText: e.target.value })}
            sx={textFieldStyles}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5, borderTop: "1px solid rgba(162, 160, 213, 0.15)" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setDeleteConfirm({ open: false, confirmText: "" })}
            sx={{
              borderRadius: 3,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
              borderColor: "rgba(162, 160, 213, 0.3)",
              color: "#A2A0D5",
              "&:hover": { borderColor: "#01F2EA", color: "#01F2EA", bgcolor: "rgba(1, 242, 234, 0.05)" },
            }}
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

      {/* Snackbar Toast feedback messages */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}