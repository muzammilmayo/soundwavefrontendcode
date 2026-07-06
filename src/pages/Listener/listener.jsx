import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton,
} from "@mui/material";
import {
  Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon,
  QueueMusic as QueueMusicIcon, Person as PersonIcon, MusicNote as MusicNoteIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import authService from "../../services/authService";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1db954" },
    background: { default: "#121212", paper: "#1c1c1c" },
    text: { primary: "#ffffff", secondary: "#b3b3b3" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

const SONGS = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { id: 2, title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
  { id: 3, title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
  { id: 4, title: "Stay", artist: "Justin Bieber", duration: "2:21" },
  { id: 5, title: "Heat Waves", artist: "Glass Animals", duration: "3:59" },
  { id: 6, title: "Golden Hour", artist: "JVKE", duration: "3:29" },
];

export default function ListenerDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => { authService.logout(); navigate("/login"); };

  const filtered = SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar */}
        <Box sx={{ width: 260, bgcolor: "black", p: 3, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 5, letterSpacing: -1 }}>
            SoundWave
          </Typography>
          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, bgcolor: "rgba(29,185,84,0.12)", color: "primary.main" }}>
                <ListItemIcon sx={{ color: "primary.main" }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><SearchIcon /></ListItemIcon>
                <ListItemText primary="Search" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><FavoriteIcon /></ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><QueueMusicIcon /></ListItemIcon>
                <ListItemText primary="Playlists" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "error.main" }}><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>Welcome Back 👋</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Enjoy your favourite music.</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, py: 0.5, border: "1px solid rgba(255,255,255,0.08)", width: 280 }}>
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: "#fff", width: "100%", fontSize: 14 }}
              />
            </Box>
          </Box>

          {/* Recently Played */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Recently Played</Typography>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {filtered.slice(0, 4).map((song) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={song.id}>
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", "&:hover": { bgcolor: "#282828", border: "1px solid rgba(29,185,84,0.3)" }, transition: "all 0.2s" }}>
                  <CardContent>
                    <Box sx={{ bgcolor: "rgba(29,185,84,0.15)", borderRadius: 3, height: 120, display: "flex", alignItems: "center", justifyContent: "center", mb: 2, border: "1px solid rgba(29,185,84,0.2)" }}>
                      <MusicNoteIcon sx={{ fontSize: 48, color: "primary.main" }} />
                    </Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>{song.title}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{song.artist}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* All Songs Table */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>All Songs</Typography>
          </Box>
          <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {filtered.map((song, idx) => (
              <Box
                key={song.id}
                sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", "&:hover": { bgcolor: "#282828" }, cursor: "pointer", transition: "all 0.15s" }}
              >
                <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>{idx + 1}</Typography>
                <Box sx={{ bgcolor: "rgba(29,185,84,0.1)", borderRadius: 1.5, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <MusicNoteIcon sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: "600", fontSize: "0.9rem" }}>{song.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>{song.artist}</Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", mr: 2 }}>{song.duration}</Typography>
                <IconButton size="small" sx={{ color: "primary.main" }}>
                  <PlayCircleFilledIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
