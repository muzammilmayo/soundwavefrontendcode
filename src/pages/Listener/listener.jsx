import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton,
  Tabs, Tab, Chip, CircularProgress, Alert, Button,
} from "@mui/material";
import {
  Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon,
  QueueMusic as QueueMusicIcon, Person as PersonIcon, MusicNote as MusicNoteIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
  Album as AlbumIcon, Close as CloseIcon, Clear as ClearIcon,
} from "@mui/icons-material";
import authService from "../../services/authService";
import {
  fetchPublicSongs,
  fetchPublicAlbums,
  fetchPublicCategories,
  fetchPublicArtists,
} from "../../features/catalog/catalogSlice";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1db954" }, // Spotify Green
    background: { default: "#121212", paper: "#181818" },
    text: { primary: "#ffffff", secondary: "#b3b3b3" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ListenerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Catalog State
  const { songs, albums, categories, artists, loading, error } = useSelector((state) => state.catalog);

  // Component State
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0 = Songs, 1 = Albums, 2 = Artists
  const [selectedCategory, setSelectedCategory] = useState(null); // Category ID to filter
  const [currentSong, setCurrentSong] = useState(null); // Playing song

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Load public catalog data
  useEffect(() => {
    dispatch(fetchPublicSongs());
    dispatch(fetchPublicAlbums());
    dispatch(fetchPublicCategories());
    dispatch(fetchPublicArtists());
  }, [dispatch]);

  // Frontend Filtering
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      (song.ArtistProfile?.stage_name || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory
      ? song.category_id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase()) ||
    (album.ArtistProfile?.stage_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredArtists = artists.filter((artist) =>
    (artist.stage_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (artist.bio || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", pb: currentSong ? 12 : 0 }}>
        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "black", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.03)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5, px: 1 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MusicNoteIcon sx={{ color: "black", fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              SoundWave
            </Typography>
          </Box>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, bgcolor: "rgba(29,185,84,0.12)", color: "primary.main" }}>
                <ListItemIcon sx={{ color: "primary.main" }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.05)" }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "#EF4444" }}><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "#EF4444" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>Welcome Back 👋</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Discover and listen to published artist music.</Typography>
            </Box>

            {/* Search Input */}
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, py: 1, border: "1px solid rgba(255,255,255,0.08)", width: 320 }}>
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <input
                type="text"
                placeholder="Search songs, albums, artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: "#fff", width: "100%", fontSize: 14 }}
              />
              {search && (
                <IconButton size="small" onClick={() => setSearch("")} sx={{ color: "text.secondary", p: 0.2 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Categories Filter Bar */}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5 }}>Categories / Genres</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
            <Chip
              label="All Genres"
              clickable
              onClick={() => setSelectedCategory(null)}
              color={selectedCategory === null ? "primary" : "default"}
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.category_id}
                label={cat.name}
                clickable
                onClick={() => setSelectedCategory(cat.category_id)}
                color={selectedCategory === cat.category_id ? "primary" : "default"}
                sx={{ fontWeight: "bold", borderRadius: 2 }}
              />
            ))}
          </Box>

          {/* Primary View Selector Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 4, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Tab label="Songs" icon={<MusicNoteIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
            <Tab label="Albums" icon={<AlbumIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
            <Tab label="Artists" icon={<PersonIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              {/* Tab 0: All Songs */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Dynamic Library</Typography>
                  {filteredSongs.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Typography sx={{ color: "text.secondary" }}>No songs found matching criteria.</Typography>
                    </Card>
                  ) : (
                    <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      {filteredSongs.map((song, idx) => (
                        <Box
                          key={song.song_id}
                          onClick={() => setCurrentSong(song)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 3,
                            py: 2.5,
                            borderBottom: idx < filteredSongs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            "&:hover": { bgcolor: "#242424" },
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>{idx + 1}</Typography>
                          <Box sx={{ bgcolor: "rgba(29,185,84,0.1)", borderRadius: 2, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, border: "1px solid rgba(29,185,84,0.15)", position: "relative" }}>
                            {song.cover_image ? (
                              <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", borderRadius: 2, objectFit: "cover" }} />
                            ) : (
                              <MusicNoteIcon sx={{ fontSize: 20, color: "primary.main" }} />
                            )}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: "600", fontSize: "0.95rem" }}>{song.title}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                              {song.ArtistProfile?.stage_name || "Unknown Artist"} {song.Album?.title ? `• ${song.Album.title}` : ""}
                            </Typography>
                          </Box>
                          {song.Category?.name && (
                            <Chip label={song.Category.name} size="small" sx={{ mr: 3, bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
                          )}
                          <IconButton size="small" sx={{ color: "primary.main" }}>
                            <PlayCircleFilledIcon sx={{ fontSize: 32 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Tab 1: Albums */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>Available Albums</Typography>
                  {filteredAlbums.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Typography sx={{ color: "text.secondary" }}>No albums found.</Typography>
                    </Card>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredAlbums.map((album) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={album.album_id}>
                          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)", bgcolor: "background.paper", "&:hover": { bgcolor: "#242424" }, transition: "0.2s" }}>
                            <Box sx={{ height: 160, bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                              {album.cover_image ? (
                                <Box component="img" src={album.cover_image} alt={album.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <AlbumIcon sx={{ color: "primary.main", fontSize: 64 }} />
                              )}
                            </Box>
                            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem", mb: 0.5 }}>{album.title}</Typography>
                              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                By {album.ArtistProfile?.stage_name || "Unknown Artist"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", height: 40, display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {album.description || "No description."}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Tab 2: Artists */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>Featured Artists</Typography>
                  {filteredArtists.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Typography sx={{ color: "text.secondary" }}>No artists found.</Typography>
                    </Card>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredArtists.map((artist) => (
                        <Grid item xs={12} sm={6} md={4} key={artist.artist_profile_id}>
                          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)", bgcolor: "background.paper", p: 3, "&:hover": { bgcolor: "#242424" }, transition: "0.2s" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                              <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(29,185,84,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(29,185,84,0.3)" }}>
                                {artist.profile_image ? (
                                  <Box component="img" src={artist.profile_image} sx={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                  <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
                                )}
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{artist.stage_name}</Typography>
                                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: "bold" }}>
                                  {artist.is_verified ? "VERIFIED ARTIST" : ""}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary", flexGrow: 1, lineBreak: "anywhere" }}>
                              {artist.bio || "No biography provided."}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Sticky Bottom Audio Player Bar */}
      {currentSong && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            bgcolor: "black",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            px: 4,
            justifyContent: "space-between",
            zIndex: 1100,
          }}
        >
          {/* Song Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}>
            <Box sx={{ width: 56, height: 56, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)" }}>
              {currentSong.cover_image ? (
                <Box component="img" src={currentSong.cover_image} sx={{ width: "100%", height: "100%", borderRadius: 2, objectFit: "cover" }} />
              ) : (
                <MusicNoteIcon sx={{ color: "primary.main", fontSize: 24 }} />
              )}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>{currentSong.title}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {currentSong.ArtistProfile?.stage_name || "Unknown Artist"}
              </Typography>
            </Box>
          </Box>

          {/* HTML5 Audio Controls */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 4 }}>
            <audio
              controls
              autoPlay
              src={`http://localhost:5000/uploads/${currentSong.audio_file}`}
              style={{ width: "100%", maxWidth: 640 }}
            />
          </Box>

          {/* Close button */}
          <IconButton onClick={() => setCurrentSong(null)} sx={{ color: "text.secondary", "&:hover": { color: "#FFFFFF" } }}>
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      )}
    </ThemeProvider>
  );
}
