import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import api from "../../api";
import authService from "../../services/authService";
import { fetchArtistProfile, fetchArtistSongs, fetchArtistAlbums } from "../../features/artist/artistSlice";
import { fetchPublicCategories, fetchFeedbacks } from "../../features/catalog/catalogSlice";

// Import Refactored Components
import ArtistSidebar from "../../components/Artist/ArtistSidebar";
import ArtistHeader from "../../components/Artist/ArtistHeader";
import ArtistStats from "../../components/Artist/ArtistStats";
import ArtistContentTabs from "../../components/Artist/ArtistContentTabs";
import ArtistPlayerBar from "../../components/Artist/ArtistPlayerBar";
import UploadSongModal from "../../components/Artist/UploadSongModal";
import CreateAlbumModal from "../../components/Artist/CreateAlbumModal";
import EditAlbumModal from "../../components/Artist/EditAlbumModal";
import AlbumDetailModal from "../../components/Artist/AlbumDetailModal";
import LyricsEditorModal from "../../components/Artist/LyricsEditorModal";

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
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Redux State
  const { profile, songs, albums, loading: artistLoading } = useSelector((state) => state.artist);
  const { user } = useSelector((state) => state.auth);
  const { categories, feedbacks } = useSelector((state) => state.catalog);

  // Component State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [currentSong, setCurrentSong] = useState(null);
  
  // Modal States
  const [uploadOpen, setUploadOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [contentTab, setContentTab] = useState(user?.role === "Moderator" ? 7 : 0); 
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Used for Album Detail View
  const [editAlbumOpen, setEditAlbumOpen] = useState(false);
  const [editAlbumData, setEditAlbumData] = useState(null);

  // Lyrics Modal State
  const [lyricsModalOpen, setLyricsModalOpen] = useState(false);
  const [lyricsModalSong, setLyricsModalSong] = useState(null);

  useEffect(() => {
    if (location.state && location.state.tab !== undefined) {
      setContentTab(location.state.tab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Sprint 4 Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [deletedSongs, setDeletedSongs] = useState([]);
  const [deletedAlbums, setDeletedAlbums] = useState([]);

  const fetchDeletedItems = async () => {
    try {
      const songsRes = await api.get("/catalog/songs/deleted");
      setDeletedSongs(songsRes.data.songs || []);
      const albumsRes = await api.get("/catalog/albums/deleted");
      setDeletedAlbums(albumsRes.data.albums || []);
    } catch (err) {
      console.error("Error loading deleted items:", err);
    }
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.get("/artist/analytics");
      setAnalytics(res.data.data);
    } catch (err) {
      console.error("fetchAnalytics error details:", err);
      const errMsg = err.response?.data?.message || err.message;
      showToast(`Failed to load analytics data: ${errMsg}`, "error");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Load Data
  useEffect(() => {
    if (user?.role === "Artist" || user?.is_artist_moderator) {
      dispatch(fetchArtistProfile());
      dispatch(fetchArtistSongs());
      dispatch(fetchArtistAlbums());
    }
    dispatch(fetchPublicCategories());
    dispatch(fetchFeedbacks());
  }, [dispatch, user]);

  // Load analytics when Tab 3 is open
  useEffect(() => {
    if (contentTab === 3) {
      fetchAnalytics();
    }
  }, [contentTab]);

  // Load deleted items when Tab 4 is open
  useEffect(() => {
    if (contentTab === 4) {
      fetchDeletedItems();
    }
  }, [contentTab]);

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
    setEditAlbumData(album);
    setEditAlbumOpen(true);
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  // ── Lyrics Handlers ────────────────────────────────────────────────────────
  const handleViewLyrics = (song) => {
    setLyricsModalSong(song);
    setLyricsModalOpen(true);
  };

  const handleEditLyrics = (song) => {
    setLyricsModalSong(song);
    setLyricsModalOpen(true);
  };

  const handleRegenerateLyrics = async (song) => {
    try {
      await api.post(`/lyrics/songs/${song.song_id}/regenerate`);
      showToast("Lyrics regeneration queued!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to queue regeneration", "error");
    }
  };

  // Reusable styling shorthand for form fields inside modals
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
        <ArtistSidebar 
          handleLogout={handleLogout} 
          setUploadOpen={setUploadOpen} 
          setAlbumOpen={setAlbumOpen} 
          contentTab={contentTab}
          setContentTab={setContentTab}
        />

        {/* --- Main Contents Space --- */}
        <Box sx={{ flexGrow: 1, ml: "260px", p: 5, pb: 10, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          {/* Header Dashboard section */}
          <ArtistHeader 
            profile={profile} 
            setUploadOpen={setUploadOpen} 
            setAlbumOpen={setAlbumOpen} 
          />

          {/* Stats Analytics Metrics Row */}
          <ArtistStats songs={songs || []} albums={albums || []} />

          {/* Dynamic Content Tabs */}
          <ArtistContentTabs 
            user={user}
            contentTab={contentTab} 
            setContentTab={setContentTab} 
            artistLoading={artistLoading} 
            songs={songs || []} 
            albums={albums || []} 
            feedbacks={feedbacks || []} 
            handleSelectSong={handleSelectSong} 
            handleDeleteSong={handleDeleteSong} 
            handleDeleteAlbum={handleDeleteAlbum} 
            handleOpenEditAlbum={handleOpenEditAlbum} 
            setSelectedAlbum={setSelectedAlbum} 
            analytics={analytics}
            analyticsLoading={analyticsLoading}
            fetchArtistSongs={() => dispatch(fetchArtistSongs())}
            fetchArtistAlbums={() => dispatch(fetchArtistAlbums())}
            showToast={showToast}
            deletedSongs={deletedSongs}
            deletedAlbums={deletedAlbums}
            fetchDeletedItems={fetchDeletedItems}
            onViewLyrics={handleViewLyrics}
            onEditLyrics={handleEditLyrics}
            onRegenerateLyrics={handleRegenerateLyrics}
          />
        </Box>
      </Box>

      {/* --- Action Dialog Modals Form Frames --- */}
      <UploadSongModal 
        open={uploadOpen} 
        setOpen={setUploadOpen} 
        categories={categories} 
        albums={albums} 
        showToast={showToast} 
        textFieldStyles={textFieldStyles} 
      />

      <CreateAlbumModal 
        open={albumOpen} 
        setOpen={setAlbumOpen} 
        showToast={showToast} 
        textFieldStyles={textFieldStyles} 
      />

      <AlbumDetailModal 
        album={selectedAlbum} 
        setAlbum={setSelectedAlbum} 
        profile={profile} 
        songs={songs} 
        handleSelectSong={handleSelectSong} 
      />

      <EditAlbumModal 
        open={editAlbumOpen} 
        setOpen={setEditAlbumOpen} 
        album={editAlbumData} 
        showToast={showToast} 
        textFieldStyles={textFieldStyles} 
      />

      {/* Lyrics Editor Modal */}
      <LyricsEditorModal
        open={lyricsModalOpen}
        onClose={() => setLyricsModalOpen(false)}
        song={lyricsModalSong}
        showToast={showToast}
        onStatusChange={(songId, status, lyrics) => {
          // Optimistically update the song in redux by re-fetching
          if (status === 'completed') dispatch(fetchArtistSongs());
        }}
      />

      {/* Bottom Player Bar */}
      <ArtistPlayerBar 
        songs={songs || []} 
        currentSong={currentSong} 
        setCurrentSong={setCurrentSong} 
      />

      {/* Styled Response Feedback Toast Alerts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}