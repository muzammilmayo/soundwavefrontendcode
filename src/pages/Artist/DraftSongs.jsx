import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, IconButton, Button, CircularProgress } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Publish as PublishIcon } from "@mui/icons-material";
import api from "../../api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, Link } from "react-router-dom";
export default function DraftSongs() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useSelector((state) => state.artist);
  const navigate = useNavigate();

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
      alert(err.response?.data?.message || "Failed to load drafts");
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
    if (!window.confirm("Delete this draft?")) return;
    try {
      await api.delete(`/catalog/songs/draft/${id}`);
      setDrafts(drafts.filter((d) => d.song_id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // -------------------------------------------------------------
  // Publish a draft song (moves it to the published list)
  // -------------------------------------------------------------
  const handlePublish = async (id) => {
    try {
      await api.post(`/catalog/songs/draft/${id}/publish`);
      setDrafts(drafts.filter((d) => d.song_id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Publish failed");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#0a0a0a" }}>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} to="/artist/dashboard" sx={{ color: "#01F2EA", borderColor: "#01F2EA", mb: 2 }}>
        Back to Dashboard
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: "#01F2EA", mb: 3 }}>
        Draft Songs
      </Typography>

      {drafts.length === 0 ? (
        <Typography sx={{ color: "#A2A0D5" }}>No drafts found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {drafts.map((song) => (
            <Grid item xs={12} sm={6} md={4} key={song.song_id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(162,160,213,0.2)",
                  backdropFilter: "blur(8px)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  ":hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(1,242,234,0.2)"
                  }
                }}
              >
                {song.cover_image && (
                  <CardMedia
                    component="img"
                    image={song.cover_image}
                    alt={song.title}
                    sx={{ height: 150, objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 1 }}>
                    {song.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#A2A0D5" }}>
                    {song.description || "(No description)"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <IconButton color="primary" onClick={() => {/* TODO: open edit modal */}}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(song.song_id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={() => handlePublish(song.song_id)}
                    sx={{
                      background: "linear-gradient(45deg, #01F2EA, #0F0C29)",
                      color: "#0a0a0a",
                      fontWeight: "bold",
                      "&:hover": { background: "linear-gradient(45deg, #01F2EA, #0F0C29)" }
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
    </Box>
  );
}
