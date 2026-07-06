import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Button, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Chip,
} from "@mui/material";
import {
  Home as HomeIcon, CloudUpload as CloudUploadIcon, MusicNote as MusicNoteIcon,
  Album as AlbumIcon, BarChart as BarChartIcon, Person as PersonIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
  TrendingUp as TrendingUpIcon,
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
  { id: 1, title: "Dreams", album: "Night Vibes", plays: "120K", duration: "3:45" },
  { id: 2, title: "Sunset", album: "Golden Hour", plays: "95K", duration: "4:12" },
  { id: 3, title: "Lost", album: "Echoes", plays: "210K", duration: "3:27" },
];

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => { authService.logout(); navigate("/login"); };

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
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><CloudUploadIcon /></ListItemIcon>
                <ListItemText primary="Upload Song" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><MusicNoteIcon /></ListItemIcon>
                <ListItemText primary="My Songs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><AlbumIcon /></ListItemIcon>
                <ListItemText primary="Albums" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><BarChartIcon /></ListItemIcon>
                <ListItemText primary="Analytics" />
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
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>Artist Dashboard 🎤</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Manage your music and monitor your audience.</Typography>
            </Box>
            <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold" }}>
              Upload Song
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {[
              { label: "Total Songs", value: "12", color: "primary.main", icon: <MusicNoteIcon /> },
              { label: "Albums", value: "3", color: "secondary.main", icon: <AlbumIcon /> },
              { label: "Followers", value: "24K", color: "#00BCD4", icon: <TrendingUpIcon /> },
              { label: "Total Plays", value: "1.5M", color: "#FF9800", icon: <PlayCircleFilledIcon /> },
            ].map((stat) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>{stat.label}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, color: stat.color }}>{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* My Songs */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>My Songs</Typography>
          <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {SONGS.map((song, idx) => (
              <Box
                key={song.id}
                sx={{ display: "flex", alignItems: "center", px: 3, py: 2.5, borderBottom: idx < SONGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", "&:hover": { bgcolor: "#282828" }, cursor: "pointer", transition: "all 0.15s" }}
              >
                <Box sx={{ bgcolor: "rgba(29,185,84,0.15)", borderRadius: 2, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, border: "1px solid rgba(29,185,84,0.2)" }}>
                  <MusicNoteIcon sx={{ color: "primary.main", fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: "600" }}>{song.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{song.album}</Typography>
                </Box>
                <Chip label={`${song.plays} plays`} size="small" sx={{ bgcolor: "rgba(29,185,84,0.1)", color: "primary.main", border: "1px solid rgba(29,185,84,0.2)", fontWeight: "bold", mr: 2 }} />
                <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", mr: 1 }}>{song.duration}</Typography>
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
