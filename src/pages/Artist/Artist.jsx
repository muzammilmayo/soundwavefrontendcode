import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import api from "../../api";
import authService from "../../services/authService";
import { fetchArtistProfile, fetchArtistSongs, fetchArtistAlbums } from "../../features/artist/artistSlice";
import { fetchPublicCategories, fetchFeedbacks } from "../../features/catalog/catalogSlice";

// Import Refactored Components
import ArtistSidebar from "./components/ArtistSidebar";
import ArtistHeader from "./components/ArtistHeader";
import ArtistStats from "./components/ArtistStats";
import ArtistContentTabs from "./components/ArtistContentTabs";
import ArtistPlayerBar from "./components/ArtistPlayerBar";
import UploadSongModal from "./components/UploadSongModal";
import CreateAlbumModal from "./components/CreateAlbumModal";
import EditAlbumModal from "./components/EditAlbumModal";
import AlbumDetailModal from "./components/AlbumDetailModal";

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
  const dispatch = useDispatch();
  
  // Redux State
  const { profile, songs, albums, loading: artistLoading } = useSelector((state) => state.artist);
  const { categories, feedbacks } = useSelector((state) => state.catalog);

  // Component State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [currentSong, setCurrentSong] = useState(null);
  
  // Modal States
  const [uploadOpen, setUploadOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [contentTab, setContentTab] = useState(0); 
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Used for Album Detail View
  const [editAlbumOpen, setEditAlbumOpen] = useState(false);
  const [editAlbumData, setEditAlbumData] = useState(null);

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
    dispatch(fetchFeedbacks());
  }, [dispatch]);

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
        />

        {/* --- Main Contents Space --- */}
        <Box sx={{ flexGrow: 1, p: 5, pb: 10, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
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