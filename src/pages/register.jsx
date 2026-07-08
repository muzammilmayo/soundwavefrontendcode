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

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F97316",
    },
    background: {
      default: "#FFF5F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#94A3B8",
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
    color: "#9333EA",
    hoverColor: "#C084FC",
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
    color: "#F97316",
    hoverColor: "#FB923C",
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
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#FFF5F0",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            border: "1px solid #FFF0E6",
            bgcolor: "#FFFFFF",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            {/* Logo */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #FDBA74, #FB7185)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 4px 15px rgba(251,113,133,0.3)",
              }}
            >
              <MusicIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1E293B", mb: 1, letterSpacing: -0.5 }}
            >
              SoundWave
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, color: "#1E293B" }}>
              Create Your Account
            </Typography>

            {/* Role Selection Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {ROLES.map((role) => (
                <Grid size={{ xs: 12, sm: 6 }} key={role.id}>
                  <Box
                    onClick={() => navigate(role.path)}
                    sx={{
                      bgcolor: "#FFFFFF",
                      p: 4,
                      borderRadius: 3,
                      cursor: "pointer",
                      border: "2px solid #FFF0E6",
                      transition: "all 0.25s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        borderColor: role.color,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
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
                        color: "#1E293B",
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
                            color: "#94A3B8",
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
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: "bold",
                        py: 1,
                        "&:hover": {
                          bgcolor: role.color,
                          color: "#FFFFFF",
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
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#F97316",
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