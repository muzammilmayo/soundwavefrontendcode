import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Button, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  CircularProgress, Snackbar, Alert, Tabs, Tab,
} from "@mui/material";
import {
  Home as HomeIcon, CloudUpload as CloudUploadIcon, MusicNote as MusicNoteIcon,
  Album as AlbumIcon, BarChart as BarChartIcon, Person as PersonIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
  TrendingUp as TrendingUpIcon, Close as CloseIcon, Add as AddIcon,
} from "@mui/icons-material";
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

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F97316" }, // Artist Orange
    background: { default: "#FFF5F0", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#94A3B8" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux State
  const { profile, songs, albums, loading: artistLoading, error: artistError } = useSelector((state) => state.artist);
  const { categories } = useSelector((state) => state.catalog);

  // Component State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [contentTab, setContentTab] = useState(0); // 0 = Songs, 1 = Albums

  // Forms State
  const [songForm, setSongForm] = useState({
    title: "",
    description: "",
    category_id: "",
    album_id: "",
    cover_image: "",
    audio: null,
  });

  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    cover_image: "",
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

  // Submit Song Upload
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
          cover_image: "",
          audio: null,
        });
        // Refresh songs
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

  // Submit Create Album
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const resultAction = await dispatch(createPublicAlbum(albumForm));
      if (createPublicAlbum.fulfilled.match(resultAction)) {
        showToast("Album created successfully!", "success");
        setAlbumOpen(false);
        setAlbumForm({
          title: "",
          description: "",
          cover_image: "",
          release_date: "",
        });
        // Refresh albums
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

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFF5F0" }}>
        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "#FFFFFF", p: 3, display: "flex", flexDirection: "column", boxShadow: "0 0 20px rgba(0,0,0,0.03)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5, px: 1 }}>
           
          </Box>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: "#FFF5F0", color: "#F97316", "&:hover": { bgcolor: "#FFF5F0" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#F97316" }}><HomeIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setUploadOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}><CloudUploadIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Upload Song" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setAlbumOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}><AlbumIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Create Album" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/artist/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#64748B", "&:hover": { bgcolor: "#FFF5F0" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#94A3B8" }}><PersonIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 5, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1E293B" }}>
                Artist Dashboard 🎤
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 0.5 }}>
                {profile?.stage_name ? `Welcome back, ${profile.stage_name}!` : "Welcome back! Customize your profile settings to get verified."}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAlbumOpen(true)}
                sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", color: "#F97316", borderColor: "#F97316", "&:hover": { bgcolor: "#FFF5F0" } }}
              >
                Create Album
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => setUploadOpen(true)}
                sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#F97316", boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
              >
                Upload Song
              </Button>
            </Box>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {[
              { label: "Total Songs", value: songs.length, color: "#F97316", icon: <MusicNoteIcon /> },
              { label: "Albums Published", value: albums.length, color: "#E91E63", icon: <AlbumIcon /> },
              { label: "Artist Profile Status", value: profile?.is_verified ? "Verified ✅" : "Pending Approval", color: profile?.is_verified ? "#10B981" : "#F59E0B", icon: <PersonIcon /> },
            ].map((stat) => (
              <Grid item xs={12} md={4} key={stat.label}>
                <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "#FFFFFF" }}>
                  <CardContent sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: stat.color }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#FFF5F0", color: stat.color }}>
                      {stat.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Tabs Selector */}
          <Tabs
            value={contentTab}
            onChange={(e, val) => setContentTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 4, borderBottom: "1px solid #FFF0E6", "& .MuiTab-root": { fontWeight: "bold", textTransform: "none", fontSize: "1.1rem" } }}
          >
            <Tab label="Published Songs" icon={<MusicNoteIcon />} iconPosition="start" />
            <Tab label="My Albums" icon={<AlbumIcon />} iconPosition="start" />
          </Tabs>

          {/* Songs List Tab */}
          {contentTab === 0 && (
            <Box>
              {artistLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : songs.length === 0 ? (
                <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", p: 4, textAlign: "center", bgcolor: "#FFFFFF" }}>
                  <Typography variant="body1" sx={{ color: "#94A3B8" }}>
                    You haven't uploaded any songs yet. Get started by clicking "Upload Song"!
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ bgcolor: "#FFFFFF", borderRadius: 4, border: "1px solid #FFF0E6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                  {songs.map((song, idx) => (
                    <Box
                      key={song.song_id}
                      sx={{ display: "flex", alignItems: "center", px: 3, py: 2.5, borderBottom: idx < songs.length - 1 ? "1px solid #FFF0E6" : "none", "&:hover": { bgcolor: "#FFF8F5" }, transition: "all 0.15s" }}
                    >
                      <Box sx={{ bgcolor: "#FFF5F0", borderRadius: 2, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, border: "1px solid #FFF0E6" }}>
                        {song.cover_image ? (
                          <Box component="img" src={song.cover_image} alt={song.title} sx={{ width: "100%", height: "100%", borderRadius: 2, objectFit: "cover" }} />
                        ) : (
                          <MusicNoteIcon sx={{ color: "#F97316", fontSize: 22 }} />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: "600", color: "#1E293B" }}>{song.title}</Typography>
                        <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                          {song.description || "No description"}
                        </Typography>
                      </Box>
                      {song.is_published ? (
                        <Chip label="Published" size="small" sx={{ bgcolor: "#E6F4EA", color: "#137333", fontWeight: "bold", mr: 2 }} />
                      ) : (
                        <Chip label="Draft" size="small" sx={{ bgcolor: "#F1F3F4", color: "#5F6368", fontWeight: "bold", mr: 2 }} />
                      )}
                      <audio controls src={`http://localhost:5000/uploads/${song.audio_file}`} style={{ height: 32 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Albums Grid Tab */}
          {contentTab === 1 && (
            <Box>
              {artistLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : albums.length === 0 ? (
                <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", p: 4, textAlign: "center", bgcolor: "#FFFFFF" }}>
                  <Typography variant="body1" sx={{ color: "#94A3B8" }}>
                    You haven't created any albums yet. Get started by clicking "Create Album"!
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {albums.map((album) => (
                    <Grid item xs={12} sm={6} md={4} key={album.album_id}>
                      <Card sx={{ borderRadius: 4, border: "1px solid #FFF0E6", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", bgcolor: "#FFFFFF" }}>
                        <Box sx={{ height: 180, bgcolor: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #FFF0E6", position: "relative" }}>
                          {album.cover_image ? (
                            <Box component="img" src={album.cover_image} alt={album.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <AlbumIcon sx={{ color: "#F97316", fontSize: 60 }} />
                          )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E293B", mb: 0.5 }}>{album.title}</Typography>
                          <Typography variant="body2" sx={{ color: "#64748B", mb: 2, height: 40, overflow: "hidden", textOverflow: "ellipsis" }}>{album.description || "No description provided."}</Typography>
                          <Divider sx={{ my: 1.5, borderColor: "#FFF0E6" }} />
                          <Typography variant="caption" sx={{ color: "#94A3B8", display: "block" }}>
                            Release Date: <strong style={{ color: "#1E293B" }}>{album.release_date ? new Date(album.release_date).toLocaleDateString() : "N/A"}</strong>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Upload Song Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Upload New Song
          <IconButton onClick={() => setUploadOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleUploadSong}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label="Song Title" name="title" value={songForm.title} onChange={handleSongChange} required disabled={actionLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Description" name="description" value={songForm.description} onChange={handleSongChange} disabled={actionLoading} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Category" name="category_id" value={songForm.category_id} onChange={handleSongChange} disabled={actionLoading}>
                  <MenuItem value="">-- Select Category --</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.category_id} value={c.category_id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Album (Optional)" name="album_id" value={songForm.album_id} onChange={handleSongChange} disabled={actionLoading}>
                  <MenuItem value="">-- None (Single) --</MenuItem>
                  {albums.map((a) => (
                    <MenuItem key={a.album_id} value={a.album_id}>{a.title}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Cover Image URL (Optional)" name="cover_image" value={songForm.cover_image} onChange={handleSongChange} disabled={actionLoading} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
                  Audio File (.mp3 or .wav) *
                </Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 2, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#F97316", borderColor: "#F97316" }}>
                  {songForm.audio ? songForm.audio.name : "Select Audio File"}
                  <input type="file" accept="audio/mp3,audio/wav,audio/mpeg" hidden onChange={handleSongFile} disabled={actionLoading} />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setUploadOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "#64748B" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}>
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Upload Song"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Create Album Dialog */}
      <Dialog open={albumOpen} onClose={() => setAlbumOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Create New Album
          <IconButton onClick={() => setAlbumOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateAlbum}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label="Album Title" name="title" value={albumForm.title} onChange={handleAlbumChange} required disabled={actionLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Description" name="description" value={albumForm.description} onChange={handleAlbumChange} disabled={actionLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Cover Image URL (Optional)" name="cover_image" value={albumForm.cover_image} onChange={handleAlbumChange} disabled={actionLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="date" label="Release Date" name="release_date" value={albumForm.release_date} onChange={handleAlbumChange} required disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setAlbumOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "#64748B" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}>
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Create Album"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar alerts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}