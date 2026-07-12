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
  KeyboardArrowRight as ArrowIcon,
} from "@mui/icons-material";

// --- Custom Theme ---
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#01F2EA", // Neon Cyan
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

// --- Role Data ---
const ROLES = [
  {
    id: "artist",
    title: "Artist",
    icon: <MusicIcon sx={{ fontSize: 48 }} />, // Larger icon
    color: "#CE04F2", // Neon Magenta
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
    icon: <HeadsetIcon sx={{ fontSize: 48 }} />, // Larger icon
    color: "#01F2EA", // Neon Cyan
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
    <ThemeProvider theme={synthTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
          // Subtle digital pattern background
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            border: "1px solid rgba(162, 160, 213, 0.2)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)", // Stronger shadow for dark mode
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            {/* --- Logo & Title Group --- */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 6,
              }}
            >
              {/* Neon Wave Icon from image_a1f6e6.jpg */}
              <MusicIcon
                sx={{
                  color: "#01F2EA",
                  fontSize: 56,
                  filter: "drop-shadow(0 0 8px #01F2EA)", // Neon Glow
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  letterSpacing: -1,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0.5,
                }}
              >
                Sound Wave
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 400 }}
                >
                
                </Typography>
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 4, color: "#FFFFFF" }}
            >
              Create Your Account
            </Typography>

            {/* --- Role Selection Cards --- */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {ROLES.map((role) => (
                <Grid size={{ xs: 12, sm: 6 }} key={role.id}>
                  <Box
                    onClick={() => navigate(role.path)}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.05)", // Ultra-subtle glass
                      p: 4,
                      borderRadius: 3,
                      cursor: "pointer",
                      border: "2px solid rgba(162, 160, 213, 0.15)", // Subtle gray border
                      transition: "all 0.3s ease-out",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      "&:hover": {
                        // Neon Border Glow on hover
                        borderColor: role.color,
                        boxShadow: `0 0 20px ${role.color}`, // Intense glow
                        "& .role-icon": {
                          filter: `drop-shadow(0 0 6px ${role.color})`, // Glow the icon
                        },
                      },
                    }}
                  >
                    {/* Icon */}
                    <Box
                      className="role-icon"
                      sx={{
                        color: role.color,
                        transition: "filter 0.3s ease",
                      }}
                    >
                      {role.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#FFFFFF",
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
                    
                    {/* Register Arrow Button */}
                    <Button
                      variant="text"
                      fullWidth
                      endIcon={<ArrowIcon fontSize="small" />}
                      sx={{
                        mt: 2,
                        color: role.color,
                        textTransform: "none",
                        fontWeight: "500",
                        justifyContent: "center",
                        "&:hover": {
                          bgcolor: "transparent",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      Register as {role.title}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* --- Login Link --- */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#01F2EA", // Neon Cyan
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