import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Publish as PublishIcon,
  ArrowBack as ArrowBackIcon,
  MusicNote as MusicNoteIcon,
} from "@mui/icons-material";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";

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

export default function DraftSongs() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const { profile } = useSelector((state) => state.artist);
  const navigate = useNavigate();

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  // -------------------------------------------------------------
  // Fetch draft songs for the logged‑in artist
  // -------------------------------------------------------------
  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/catalog/songs/drafts");
      setDrafts(res.data.drafts || []);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to load drafts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // -------------------------------------------------------------
  // Delete a draft song
  // -------------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await api.delete(`/catalog/songs/draft/${id}`);
      setDrafts(drafts.filter((d) => d.song_id !== id));
      showToast("Draft deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  // -------------------------------------------------------------
  // Publish a draft song (moves it to the published list)
  // -------------------------------------------------------------
  const handlePublish = async (id) => {
    try {
      await api.post(`/catalog/songs/draft/${id}/publish`);
      setDrafts(drafts.filter((d) => d.song_id !== id));
      showToast("Song published successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Publish failed", "error");
    }
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 2, sm: 4, md: 5 },
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Header Action Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/artist/dashboard"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              borderColor: "rgba(162, 160, 213, 0.3)",
              color: "#A2A0D5",
              px: 2.5,
              py: 1,
              transition: "all 0.2s ease-in-out",
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              letterSpacing: -0.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            Draft Songs 📝
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress sx={{ color: "#01F2EA" }} />
          </Box>
        ) : drafts.length === 0 ? (
          <Card
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid rgba(162, 160, 213, 0.2)",
              bgcolor: "background.paper",
              maxWidth: 600,
              mx: "auto",
              mt: 4,
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 1, fontWeight: "bold" }}>
              No Draft Songs Found
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              All your created songs have been published, or you haven't saved any drafts yet.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {drafts.map((song) => (
              <Grid item xs={12} sm={6} md={4} key={song.song_id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(162, 160, 213, 0.2)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    transition: "all 0.25s ease-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#01F2EA",
                      boxShadow: "0 0 20px rgba(1, 242, 234, 0.25)",
                    },
                  }}
                >
                  {/* Song Cover Media or Fallback Box */}
                  <Box
                    sx={{
                      height: 180,
                      width: "100%",
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid rgba(162, 160, 213, 0.15)",
                      overflow: "hidden",
                    }}
                  >
                    {song.cover_image ? (
                      <CardMedia
                        component="img"
                        image={song.cover_image}
                        alt={song.title}
                        sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 56, filter: "drop-shadow(0 0 6px #01F2EA)" }} />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 1 }}>
                      {song.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {song.description || "(No description provided)"}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", p: 2, borderTop: "1px solid rgba(162, 160, 213, 0.15)" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        sx={{ color: "text.secondary", "&:hover": { color: "#01F2EA", bgcolor: "rgba(1, 242, 234, 0.1)" } }}
                        onClick={() => {/* TODO: open edit modal */}}
                        title="Edit Draft"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: "text.secondary", "&:hover": { color: "#EF4444", bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                        onClick={() => handleDelete(song.song_id)}
                        title="Delete Draft"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<PublishIcon />}
                      onClick={() => handlePublish(song.song_id)}
                      sx={{
                        borderRadius: 3,
                        px: 2.5,
                        py: 0.8,
                        textTransform: "none",
                        fontWeight: "bold",
                        bgcolor: "#01F2EA",
                        color: "#100B29",
                        boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                        transition: "all 0.2s ease-out",
                        "&:hover": {
                          bgcolor: "#00DDD5",
                          boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)",
                        },
                      }}
                    >
                      Publish
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Feedback Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToast({ ...toast, open: false })}
            severity={toast.severity}
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444",
              color: "#100B29",
              fontWeight: "bold",
              "& .MuiAlert-icon": { color: "#100B29" },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}