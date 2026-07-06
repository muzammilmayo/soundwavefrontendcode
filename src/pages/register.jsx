import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import {
  MusicNote as MusicIcon,
  Headset as HeadsetIcon,
  Upload as UploadIcon,
  Album as AlbumIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  PlaylistPlay as PlaylistIcon,
  HighQuality as QualityIcon,
} from "@mui/icons-material";

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

const ROLES = [
  {
    id: "artist",
    title: "Artist",
    icon: <MusicIcon sx={{ fontSize: 40 }} />,
    color: "#a855f7",
    hoverColor: "#c084fc",
    features: [
      { icon: <UploadIcon fontSize="small" />, text: "Upload Songs" },
      { icon: <AlbumIcon fontSize="small" />, text: "Create Albums" },
      { icon: <TrendingIcon fontSize="small" />, text: "View Analytics" },
      { icon: <PeopleIcon fontSize="small" />, text: "Grow Audience" },
    ],
    path: "/artist/register",
  },
  {
    id: "listener",
    title: "Listener",
    icon: <HeadsetIcon sx={{ fontSize: 40 }} />,
    color: "#1db954",
    hoverColor: "#4ade80",
    features: [
      { icon: <MusicIcon fontSize="small" />, text: "Stream Music" },
      { icon: <FavoriteIcon fontSize="small" />, text: "Like Songs" },
      { icon: <PlaylistIcon fontSize="small" />, text: "Create Playlists" },
      { icon: <QualityIcon fontSize="small" />, text: "High Quality Audio" },
    ],
    path: "/listener/register",
  },
];

export default function Register() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            {/* Logo */}
            <Typography variant="h2" sx={{ mb: 1 }}>
              🎵
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              SoundWave
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Create Your Account
            </Typography>

            {/* Role Selection Cards - FIXED: Grid instead of Grid2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {ROLES.map((role) => (
                <Grid size={{ xs: 12, sm: 6 }} key={role.id}>
                  <Box
                    onClick={() => navigate(role.path)}
                    sx={{
                      bgcolor: "#252525",
                      p: 4,
                      borderRadius: 3,
                      cursor: "pointer",
                      border: "2px solid transparent",
                      transition: "all 0.25s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        borderColor: role.color,
                        bgcolor: "#2a2a2a",
                      },
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        color: role.color,
                        mb: 1,
                      }}
                    >
                      {role.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {role.title}
                    </Typography>

                    {/* Features List */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        alignItems: "flex-start",
                        width: "100%",
                        mt: 1,
                      }}
                    >
                      {role.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: "text.secondary",
                            fontSize: "0.9rem",
                          }}
                        >
                          <Box sx={{ color: role.color, display: "flex" }}>
                            {feature.icon}
                          </Box>
                          {feature.text}
                        </Box>
                      ))}
                    </Box>

                    {/* Select Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderColor: role.color,
                        color: role.color,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: role.color,
                          color: "white",
                          borderColor: role.color,
                        },
                      }}
                    >
                      Register as {role.title}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Login Link */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1db954",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}