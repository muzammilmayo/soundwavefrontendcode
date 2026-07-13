import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Button, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  CircularProgress, Snackbar, Alert, Tabs, Tab, Tooltip,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import {
  Home as HomeIcon, CloudUpload as CloudUploadIcon, MusicNote as MusicNoteIcon,
  Album as AlbumIcon, Person as PersonIcon, ExitToApp as ExitToAppIcon, 
  Close as CloseIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Comment as CommentIcon, Star as StarRateIcon, CheckCircle as CheckCircleIcon,
  SkipPrevious as SkipPreviousIcon, PlayArrow as PlayArrowIcon, Pause as PauseIcon,
  SkipNext as SkipNextIcon, Shuffle as ShuffleIcon, Repeat as RepeatIcon, VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";
import api from "../../api";
import authService from "../../services/authService";
import {
  fetchArtistProfile,
  fetchArtistSongs,
  fetchArtistAlbums,
  uploadArtistSong,
} from "../../features/artist/artistSlice";
import {
  fetchPublicCategories,
  createPublicAlbum,
} from "../../features/catalog/catalogSlice";

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

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux State
  const { profile, songs, albums, loading: artistLoading, error: artistError } = useSelector((state) => state.artist);
  const { categories, feedbacks } = useSelector((state) => state.catalog);

  // Component State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0=off,1=all,2=single
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [contentTab, setContentTab] = useState(0); 
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [editAlbumOpen, setEditAlbumOpen] = useState(false);
  const [editAlbumForm, setEditAlbumForm] = useState({
    album_id: "",
    title: "",
    description: "",
    cover_image: "",
    release_date: "",
  });

  // Forms State
  const [songForm, setSongForm] = useState({
    title: "",
    description: "",
    category_id: "",
    album_id: "",
    cover_image: null,
    audio: null,
  });

  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    release_date: "",
  });

  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Load Data
  useEffect(() => {
    dispatch(fetchArtistProfile());
    dispatch(fetchArtistSongs());
    dispatch(fetchArtistAlbums());
    dispatch(fetchPublicCategories());
  }, [dispatch]);

  // Form handlers
  const handleSongChange = (e) => {
    setSongForm({ ...songForm, [e.target.name]: e.target.value });
  };

  const handleSongFile = (e) => {
    setSongForm({ ...songForm, audio: e.target.files[0] });
  };

  const handleAlbumChange = (e) => {
    setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song from your catalog?")) return;
    try {
      await api.delete(`/catalog/songs/${id}`);
      showToast("Song deleted successfully!", "success");
      dispatch(fetchArtistSongs());
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete song", "error");
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm("Are you sure you want to delete this album?")) return;
    try {
      await api.delete(`/catalog/albums/${id}`);
      showToast("Album deleted successfully!", "success");
      dispatch(fetchArtistAlbums());
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete album", "error");
    }
  };

  const handleOpenEditAlbum = (album) => {
    setEditAlbumForm({
      album_id: album.album_id,
      title: album.title || "",
      description: album.description || "",
      cover_image: album.cover_image || "",
      release_date: album.release_date ? album.release_date.split("T")[0] : "",
    });
    setEditAlbumOpen(true);
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/catalog/albums/${editAlbumForm.album_id}`, {
        title: editAlbumForm.title,
        description: editAlbumForm.description,
        cover_image: editAlbumForm.cover_image,
        release_date: editAlbumForm.release_date || null,
      });
      showToast("Album updated successfully!", "success");
      setEditAlbumOpen(false);
      dispatch(fetchArtistAlbums());
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update album", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- Audio Player Logic ----------
  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.song_id === currentSong.song_id);
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    handleSelectSong(songs[prevIdx]);
  };

  const handleNext = () => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.song_id === currentSong.song_id);
    const nextIdx = (idx + 1) % songs.length;
    handleSelectSong(songs[nextIdx]);
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    if (audioRef.current) audioRef.current.volume = newValue;
  };

  const handleProgressChange = (e, newValue) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const toggleShuffle = () => setShuffle((prev) => !prev);

  const cycleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

  // Sync audio src & playback when currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `http://localhost:5000/uploads/${currentSong.audio_file}`;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentSong]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Audio event listeners for time & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [repeatMode, songs, currentSong]);

  const handleUploadSong = async (e) => {
    e.preventDefault();
    if (!songForm.audio) {
      showToast("Audio file is required!", "error");
      return;
    }
    setActionLoading(true);

    const formData = new FormData();
    formData.append("title", songForm.title);
    formData.append("description", songForm.description);
    if (songForm.category_id) formData.append("category_id", songForm.category_id);
    if (songForm.album_id) formData.append("album_id", songForm.album_id);
    if (songForm.cover_image) formData.append("cover_image", songForm.cover_image);
    formData.append("audio", songForm.audio);

    try {
      const resultAction = await dispatch(uploadArtistSong(formData));
      if (uploadArtistSong.fulfilled.match(resultAction)) {
        showToast("Song uploaded successfully!", "success");
        setUploadOpen(false);
        setSongForm({
          title: "",
          description: "",
          category_id: "",
          album_id: "",
          cover_image: null,
          audio: null,
        });
        dispatch(fetchArtistSongs());
      } else {
        showToast(resultAction.payload || "Failed to upload song", "error");
      }
    } catch (err) {
      showToast("Server error during upload", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description);
    formData.append("release_date", albumForm.release_date || "");
    if (albumForm.cover_image) {
      formData.append("cover_image", albumForm.cover_image);
    }

    try {
      const resultAction = await dispatch(createPublicAlbum(formData));
      if (createPublicAlbum.fulfilled.match(resultAction)) {
        showToast("Album created successfully!", "success");
        setAlbumOpen(false);
        setAlbumForm({
          title: "",
          description: "",
          cover_image: null,
          release_date: "",
        });
        dispatch(fetchArtistAlbums());
      } else {
        showToast(resultAction.payload || "Failed to create album", "error");
      }
    } catch (err) {
      showToast("Server error during album creation", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Reusable styling shorthand for form fields
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
        
        {/* --- Sidebar Layout --- */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)" }}>
       

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#01F2EA" }}><HomeIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ "& .MuiListItemText-primary": { fontWeight: "bold" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setUploadOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><CloudUploadIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Upload Song" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setAlbumOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><AlbumIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Create Album" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2, borderColor: "rgba(162,160,213,0.15)" }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/artist/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><PersonIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Profile" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* --- Main Contents Space --- */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          {/* Header Dashboard section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                Artist Dashboard 🎤
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {profile?.stage_name ? `Welcome back, ${profile.stage_name}!` : "Welcome back! Customize your profile settings to get verified."}
                </Typography>
                {profile?.is_verified && (
                  <Tooltip title="Verified Artist">
                    <CheckCircleIcon sx={{ color: "#01F2EA", fontSize: 16 }} />
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAlbumOpen(true)}
                sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", color: "#CE04F2", borderColor: "#CE04F2", "&:hover": { bgcolor: "rgba(206,4,242,0.05)" } }}
              >
                Create Album
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => setUploadOpen(true)}
                sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", boxShadow: "0 4px 14px rgba(1,242,234,0.3)", "&:hover": { bgcolor: "#00DDD5" } }}
              >
                Upload Song
              </Button>
            </Box>
          </Box>

          {/* Stats Analytics Metrics Row */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {[
              { label: "Total Songs", value: songs.length, color: "#01F2EA", icon: <MusicNoteIcon /> },
              { label: "Albums Published", value: albums.length, color: "#CE04F2", icon: <AlbumIcon /> },
            ].map((stat) => (
              <Grid item xs={12} md={6} key={stat.label}>
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                  <CardContent sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: stat.color, filter: `drop-shadow(0 0 4px ${stat.color}40)` }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)", border: `1px solid ${stat.color}40`, color: stat.color }}>
                      {stat.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Dynamic Content Tabs */}
          <Tabs
            value={contentTab}
            onChange={(e, val) => setContentTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" }, "& .MuiTab-root": { fontWeight: "bold", textTransform: "none", fontSize: "1rem", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } } }}
          >
            <Tab label="Published Songs" icon={<MusicNoteIcon />} iconPosition="start" />
            <Tab label="My Albums" icon={<AlbumIcon />} iconPosition="start" />
            <Tab label="Fan Feedback" icon={<CommentIcon />} iconPosition="start" />
          </Tabs>

          {/* Content Panels Workspace */}
          {contentTab === 0 && (
            <Box>
              {artistLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
              ) : (!songs || songs.length === 0) ? (
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", p: 4, textAlign: "center", bgcolor: "background.paper" }}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    You haven't uploaded any songs yet. Get started by clicking "Upload Song"!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                  {(songs || []).map((song, idx) => (
                    <Box
                      key={song.song_id}
                      onClick={() => handleSelectSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2.5, borderBottom: idx < songs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }, transition: "all 0.15s", cursor: "pointer" }}
                    >
                      <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                        {song.cover_image ? (
                          <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 22 }} />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: "600", color: "#FFFFFF" }}>{song.title}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {song.description || "No description"}
                        </Typography>
                      </Box>
                      {song.is_published ? (
                        <Chip label="Published" size="small" sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: "bold", mr: 2 }} />
                      ) : (
                        <Chip label="Draft" size="small" sx={{ bgcolor: "rgba(162,160,213,0.15)", color: "text.secondary", fontWeight: "bold", mr: 2 }} />
                      )}
                      {/* Inline audio removed – playback is handled by bottom bar */}
                      <IconButton color="error" size="small" onClick={() => handleDeleteSong(song.song_id)} sx={{ ml: 2, "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {contentTab === 1 && (
            <Box>
              {artistLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
              ) : (!albums || albums.length === 0) ? (
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", p: 4, textAlign: "center", bgcolor: "background.paper" }}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    You haven't created any albums yet. Get started by clicking "Create Album"!
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {(albums || []).map((album) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={album.album_id}>
                      <Card 
                        onClick={() => setSelectedAlbum(album)} 
                        sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", maxWidth: 190, bgcolor: "background.paper", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", borderColor: "#01F2EA", boxShadow: "0 0 15px rgba(1,242,234,0.2)" }, transition: "all 0.2s" }}
                      >
                        <Box sx={{ aspectRatio: "1/1", width: "100%", bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(162,160,213,0.1)", position: "relative", overflow: "hidden" }}>
                          {album.cover_image ? (
                            <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <AlbumIcon sx={{ color: "#01F2EA", fontSize: 44 }} />
                          )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{album.title}</Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, height: 32, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.2 }}>{album.description || "No description provided."}</Typography>
                          </Box>
                          <Box>
                            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.1)" }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                                Rel: <strong style={{ color: "#FFFFFF" }}>{album.release_date ? new Date(album.release_date).toLocaleDateString(undefined, {month: 'numeric', year: '2-digit'}) : "N/A"}</strong>
                              </Typography>
                              <Box sx={{ display: "flex" }}>
                                <IconButton color="primary" size="small" onClick={(e) => { e.stopPropagation(); handleOpenEditAlbum(album); }} sx={{ p: 0.5 }}>
                                  <EditIcon sx={{ fontSize: "0.95rem" }} />
                                </IconButton>
                                <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.album_id); }} sx={{ p: 0.5 }}>
                                  <DeleteIcon sx={{ fontSize: "0.95rem" }} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {contentTab === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Fan Reviews & Ratings</Typography>
              {(() => {
                const parsed = feedbacks || [];
                const artistSongIds = songs.map(s => s.song_id);
                const filtered = parsed.filter(f => artistSongIds.includes(f.song_id));

                if (filtered.length === 0) {
                  return (
                    <Card sx={{ p: 5, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                      <Typography sx={{ color: "text.secondary" }}>No reviews or feedback received from listeners yet.</Typography>
                    </Card>
                  );
                }

                return (
                  <Grid container spacing={3}>
                    {filtered.map((f) => {
                      const matchedSong = songs.find(s => s.song_id === f.song_id);
                      return (
                        <Grid item xs={12} md={6} key={f.id}>
                          <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pb: 2, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                                <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {matchedSong?.cover_image ? <Box component="img" src={matchedSong.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.song_title || matchedSong?.title}</Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Track Review</Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "#01F2EA" }}>{f.username}</Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>{new Date(f.timestamp).toLocaleDateString()}</Typography>
                              </Box>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                                {[...Array(5)].map((_, i) => (
                                  <StarRateIcon key={i} sx={{ color: i < f.rating ? "#FBBF24" : "rgba(255,255,255,0.1)", fontSize: "1.1rem" }} />
                                ))}
                                <Typography variant="caption" sx={{ ml: 1, fontWeight: "bold", color: "text.secondary" }}>({f.rating}/5)</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", lineBreak: "anywhere" }}>"{f.comment}"</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })()}
            </Box>
          )}
        </Box>
      </Box>

      {/* --- Action Dialog Modals Form Frames --- */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
          Upload New Song
          <IconButton onClick={() => setUploadOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleUploadSong}>
          <DialogContent sx={{ px: 3, py: 2, overflowY: "auto", maxHeight: "60vh" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField fullWidth label="Song Title" name="title" value={songForm.title} onChange={handleSongChange} required disabled={actionLoading} placeholder="Enter song name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth multiline rows={2} label="Description" name="description" value={songForm.description} onChange={handleSongChange} disabled={actionLoading} placeholder="Tell your fans about this song" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth select label="Category" name="category_id" value={songForm.category_id} onChange={handleSongChange} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles}>
                <MenuItem value="">-- Select Category --</MenuItem>
                {(categories || []).map((c) => <MenuItem key={c.category_id} value={c.category_id}>{c.name}</MenuItem>)}
              </TextField>
              <TextField fullWidth select label="Album (Optional)" name="album_id" value={songForm.album_id} onChange={handleSongChange} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles}>
                <MenuItem value="">-- None (Single) --</MenuItem>
                {(albums || []).map((a) => <MenuItem key={a.album_id} value={a.album_id}>{a.title}</MenuItem>)}
              </TextField>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Cover Image File (Optional)</Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#01F2EA", borderColor: "rgba(1,242,234,0.4)" }}>
                  {songForm.cover_image ? songForm.cover_image.name : "Select Cover Image"}
                  <input type="file" accept="image/*" hidden onChange={(e) => setSongForm({ ...songForm, cover_image: e.target.files[0] })} disabled={actionLoading} />
                </Button>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Audio File (.mp3 or .wav) *</Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#CE04F2", borderColor: "rgba(206,4,242,0.4)" }}>
                  {songForm.audio ? songForm.audio.name : "Select Audio File"}
                  <input type="file" accept="audio/mp3,audio/wav,audio/mpeg" hidden onChange={handleSongFile} disabled={actionLoading} />
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(162,160,213,0.15)" }}>
            <Button onClick={() => setUploadOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", boxShadow: "0 4px 14px rgba(1,242,234,0.3)" }}>
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Upload Song"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={albumOpen} onClose={() => setAlbumOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
          Create New Album
          <IconButton onClick={() => setAlbumOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateAlbum}>
          <DialogContent sx={{ px: 3, py: 1, overflowY: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField fullWidth label="Album Title" name="title" value={albumForm.title} onChange={handleAlbumChange} required disabled={actionLoading} placeholder="Enter album name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth multiline rows={2} label="Description" name="description" value={albumForm.description} onChange={handleAlbumChange} disabled={actionLoading} placeholder="Tell your listeners about this album" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth type="date" label="Release Date" name="release_date" value={albumForm.release_date} onChange={handleAlbumChange} required disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Cover Image File (Optional)</Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#01F2EA", borderColor: "rgba(1,242,234,0.4)" }}>
                  {albumForm.cover_image ? albumForm.cover_image.name : "Select Cover Image"}
                  <input type="file" accept="image/*" hidden onChange={(e) => setAlbumForm({ ...albumForm, cover_image: e.target.files[0] })} disabled={actionLoading} />
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(162,160,213,0.15)" }}>
            <Button onClick={() => setAlbumOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29" }}>Create Album</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Album Tracks Detail Workspace Dialog Overlay */}
      <Dialog open={!!selectedAlbum} onClose={() => setSelectedAlbum(null)} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        {selectedAlbum && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
              <IconButton onClick={() => setSelectedAlbum(null)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{selectedAlbum.title}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>By {profile?.stage_name || "You"} • {(songs || []).filter(s => s.album_id === selectedAlbum.album_id).length} songs</Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 3 }}>
              <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "center" }}>
                <Box sx={{ width: 140, height: 140, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.02)" }}>
                  {selectedAlbum.cover_image ? <Box component="img" src={selectedAlbum.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 60 }} />}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>{selectedAlbum.description || "No description provided."}</Typography>
                  <Typography variant="body2" sx={{ color: "#FFFFFF" }}>Released: <strong>{selectedAlbum.release_date ? new Date(selectedAlbum.release_date).toLocaleDateString() : "N/A"}</strong></Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3, borderColor: "rgba(162,160,213,0.15)" }} />
              <Box sx={{ bgcolor: "rgba(255,255,255,0.01)", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.1)" }}>
                {(songs || []).filter(s => s.album_id === selectedAlbum.album_id).map((song, idx) => (
                    <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }, cursor: "pointer" }} onClick={() => handleSelectSong(song)}>
                    <Typography sx={{ color: "text.secondary", mr: 2 }}>{idx + 1}</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: "600", flexGrow: 1 }}>{song.title}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Edit Album Parameters Workspace Dialogue */}
      <Dialog open={editAlbumOpen} onClose={() => setEditAlbumOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
          Modify Album ✏️
          <IconButton onClick={() => setEditAlbumOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleUpdateAlbum}>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField fullWidth label="Album Title" value={editAlbumForm.title} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, title: e.target.value })} required disabled={actionLoading} placeholder="Enter album name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth multiline rows={2} label="Album Description" value={editAlbumForm.description} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, description: e.target.value })} disabled={actionLoading} placeholder="Enter description" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth label="Cover Image URL" value={editAlbumForm.cover_image} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, cover_image: e.target.value })} disabled={actionLoading} placeholder="URL path" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
              <TextField fullWidth type="date" label="Release Date" value={editAlbumForm.release_date} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, release_date: e.target.value })} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
            <Button onClick={() => setEditAlbumOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29" }}>Save Changes</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Bottom Player Bar */}
      <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, bgcolor: "rgba(20,14,52,0.9)", backdropFilter: "blur(8px)", px: 2, py: 1, display: "flex", alignItems: "center", gap: 2, zIndex: 1000 }}>
        {/* Track Info */}
        {currentSong ? (
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
            <Box component="img" src={currentSong.cover_image || ""} alt="cover" sx={{ width: 40, height: 40, borderRadius: 1, mr: 1, objectFit: "cover" }} />
            <Typography variant="body2" sx={{ color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
              {currentSong.title}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#A2A0D5" }}>Select a song</Typography>
        )}
        {/* Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: 2 }}>
          <IconButton onClick={toggleShuffle} sx={{ color: shuffle ? "#01F2EA" : "#A2A0D5" }}>
            <ShuffleIcon />
          </IconButton>
          <IconButton onClick={handlePrev} sx={{ color: "#A2A0D5" }}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={handlePlayPause} sx={{ color: "#01F2EA" }}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={handleNext} sx={{ color: "#A2A0D5" }}>
            <SkipNextIcon />
          </IconButton>
          <IconButton onClick={cycleRepeat} sx={{ color: repeatMode !== 0 ? "#01F2EA" : "#A2A0D5" }}>
            <RepeatIcon />
          </IconButton>
        </Box>
        {/* Progress Slider */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <Slider
            size="small"
            value={currentTime}
            min={0}
            max={duration || 0}
            onChange={handleProgressChange}
            sx={{ color: "#01F2EA" }}
          />
        </Box>
        {/* Time */}
        <Typography variant="caption" sx={{ color: "#A2A0D5", minWidth: 50, textAlign: "right" }}>
          {`${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, "0")}`}
        </Typography>
        {/* Volume */}
        <Box sx={{ width: 100, mx: 1 }}>
          <Slider
            size="small"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            sx={{ color: "#01F2EA" }}
          />
        </Box>
      </Box>

      {/* Styled Response Feedback Toast Alerts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
      <audio ref={audioRef} style={{ display: "none" }} />
    </ThemeProvider>
  );
}