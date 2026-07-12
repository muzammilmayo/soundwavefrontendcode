import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, IconButton,
  Tabs, Tab, Chip, CircularProgress, Alert, Button, Dialog,
  DialogTitle, DialogContent, Slider, TextField, DialogActions,
  Snackbar, Avatar, Rating, Tooltip, Fade, Paper, Menu, MenuItem
} from "@mui/material";
import {
  Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon,
  QueueMusic as QueueMusicIcon, Person as PersonIcon, MusicNote as MusicNoteIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
  Album as AlbumIcon, Close as CloseIcon, Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon, Pause as PauseIcon,
  SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon,
  VolumeUp as VolumeUpIcon, Add as AddIcon, PlaylistAdd as PlaylistAddIcon, Comment as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon, Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon,
  GetApp as DownloadIcon, LibraryMusic as LibraryMusicIcon,
  MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon,
  Star as StarIcon, StarBorder as StarBorderIcon, Send as SendIcon
} from "@mui/icons-material";
import authService from "../../services/authService";
import {
  fetchPublicSongs,
  fetchPublicAlbums,
  fetchPublicCategories,
  fetchPublicArtists,
} from "../../features/catalog/catalogSlice";

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

export default function ListenerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Catalog State
  const { songs, albums, categories, artists, loading, error } = useSelector((state) => state.catalog);

  // Component State
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [currentSong, setCurrentSong] = useState(null); 

  // Playlist State
  const [playlists, setPlaylists] = useState(() => {
    const user = authService.getUser();
    const userId = user?.id || "guest";
    const saved = localStorage.getItem("soundwave_playlists_" + userId);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); 

  // Dialog & Form states
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState(null);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const savePlaylists = (newPlaylists) => {
    setPlaylists(newPlaylists);
    const user = authService.getUser();
    const userId = user?.id || "guest";
    localStorage.setItem("soundwave_playlists_" + userId, JSON.stringify(newPlaylists));
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: "playlist_" + Date.now(),
      name: newPlaylistName.trim(),
      songs: []
    };
    savePlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setCreatePlaylistOpen(false);
  };

  const handleAddSongToPlaylist = (playlistId) => {
    if (!songToAddToPlaylist) return;
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        if (p.songs.some(s => s.song_id === songToAddToPlaylist.song_id)) {
          return p;
        }
        return { ...p, songs: [...p.songs, songToAddToPlaylist] };
      }
      return p;
    });
    savePlaylists(updated);
    setAddToPlaylistOpen(false);
    setSongToAddToPlaylist(null);
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist(updated.find(p => p.id === playlistId));
    }
  };

  // Music Library States
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem(`soundwave_liked_songs_${authService.getUser()?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedAlbums, setSavedAlbums] = useState(() => {
    const saved = localStorage.getItem(`soundwave_saved_albums_${authService.getUser()?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [followedArtists, setFollowedArtists] = useState(() => {
    const saved = localStorage.getItem(`soundwave_followed_artists_${authService.getUser()?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [downloadedSongs, setDownloadedSongs] = useState(() => {
    const saved = localStorage.getItem(`soundwave_downloaded_songs_${authService.getUser()?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [libraryTab, setLibraryTab] = useState(0);

  const toggleLikeSong = (song) => {
    const userId = authService.getUser()?.id;
    let updated;
    if (likedSongs.some(s => s.song_id === song.song_id)) {
      updated = likedSongs.filter(s => s.song_id !== song.song_id);
    } else {
      updated = [...likedSongs, song];
    }
    setLikedSongs(updated);
    localStorage.setItem(`soundwave_liked_songs_${userId}`, JSON.stringify(updated));
  };

  const toggleSaveAlbum = (album) => {
    const userId = authService.getUser()?.id;
    let updated;
    if (savedAlbums.some(a => a.album_id === album.album_id)) {
      updated = savedAlbums.filter(a => a.album_id !== album.album_id);
    } else {
      updated = [...savedAlbums, album];
    }
    setSavedAlbums(updated);
    localStorage.setItem(`soundwave_saved_albums_${userId}`, JSON.stringify(updated));
  };

  const toggleFollowArtist = (artist) => {
    const userId = authService.getUser()?.id;
    let updated;
    if (followedArtists.some(a => a.artist_profile_id === artist.artist_profile_id)) {
      updated = followedArtists.filter(a => a.artist_profile_id !== artist.artist_profile_id);
    } else {
      updated = [...followedArtists, artist];
    }
    setFollowedArtists(updated);
    localStorage.setItem(`soundwave_followed_artists_${userId}`, JSON.stringify(updated));
  };

  const downloadSong = (song) => {
    const userId = authService.getUser()?.id;
    if (downloadedSongs.some(s => s.song_id === song.song_id)) {
      return;
    }
    try {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/uploads/${song.audio_file}`;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
    const updated = [...downloadedSongs, song];
    setDownloadedSongs(updated);
    localStorage.setItem(`soundwave_downloaded_songs_${userId}`, JSON.stringify(updated));
  };

  const removeDownloadedSong = (songId) => {
    const userId = authService.getUser()?.id;
    const updated = downloadedSongs.filter(s => s.song_id !== songId);
    setDownloadedSongs(updated);
    localStorage.setItem(`soundwave_downloaded_songs_${userId}`, JSON.stringify(updated));
  };

  // ===== ENHANCED REVIEWS & COMMENTS SYSTEM =====
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSong, setFeedbackSong] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [songFeedbacks, setSongFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [feedbackSortBy, setFeedbackSortBy] = useState("newest"); // "newest" | "highest" | "lowest"
  const [feedbackFilter, setFeedbackFilter] = useState("all"); // "all" | "mine"
  const [feedbackAnchorEl, setFeedbackAnchorEl] = useState(null);
  const [selectedFeedbackMenu, setSelectedFeedbackMenu] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState({ total: 0, average: 0, distribution: [0,0,0,0,0] });

  const currentUser = authService.getUser();

  const getAllFeedbacks = () => {
    const all = localStorage.getItem("soundwave_song_feedbacks");
    return all ? JSON.parse(all) : [];
  };

  const calculateStats = (feedbacks) => {
    if (feedbacks.length === 0) return { total: 0, average: 0, distribution: [0,0,0,0,0] };
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const average = (sum / total).toFixed(1);
    const distribution = [0,0,0,0,0];
    feedbacks.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) distribution[f.rating - 1]++;
    });
    return { total, average, distribution };
  };

  useEffect(() => {
    if (feedbackSong && feedbackOpen) {
      const all = getAllFeedbacks();
      const filtered = all.filter(f => f.song_id === feedbackSong.song_id);
      setSongFeedbacks(filtered);
      setFeedbackStats(calculateStats(filtered));
    }
  }, [feedbackSong, feedbackOpen]);

  const getSortedAndFilteredFeedbacks = () => {
    let filtered = [...songFeedbacks];
    if (feedbackFilter === "mine") {
      filtered = filtered.filter(f => f.user_id === currentUser?.id);
    }
    switch (feedbackSortBy) {
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating || new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating || new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
    }
    return filtered;
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    const user = authService.getUser();
    const username = user?.username || "Anonymous Listener";
    const userId = user?.id || "guest";

    const all = getAllFeedbacks();

    if (editingFeedback) {
      // Update existing review
      const updated = all.map(f => {
        if (f.id === editingFeedback.id) {
          return { ...f, rating: feedbackRating, comment: feedbackComment.trim(), edited: true, editedAt: new Date().toISOString() };
        }
        return f;
      });
      localStorage.setItem("soundwave_song_feedbacks", JSON.stringify(updated));
      setSongFeedbacks(updated.filter(f => f.song_id === feedbackSong.song_id));
      setFeedbackStats(calculateStats(updated.filter(f => f.song_id === feedbackSong.song_id)));
      setEditingFeedback(null);
      setToast({ open: true, message: "Review updated successfully!", severity: "success" });
    } else {
      // Create new review
      const newFeedback = {
        id: "feed_" + Date.now(),
        song_id: feedbackSong.song_id,
        song_title: feedbackSong.title,
        user_id: userId,
        username,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        timestamp: new Date().toISOString(),
        edited: false,
        likes: 0,
        likedBy: []
      };
      const updated = [newFeedback, ...all];
      localStorage.setItem("soundwave_song_feedbacks", JSON.stringify(updated));
      setSongFeedbacks([newFeedback, ...songFeedbacks]);
      setFeedbackStats(calculateStats([newFeedback, ...songFeedbacks]));
      setToast({ open: true, message: "Review posted successfully!", severity: "success" });
    }

    setFeedbackComment("");
    setFeedbackRating(5);
  };

  const handleDeleteFeedback = (feedbackId) => {
    const all = getAllFeedbacks();
    const updated = all.filter(f => f.id !== feedbackId);
    localStorage.setItem("soundwave_song_feedbacks", JSON.stringify(updated));
    const remaining = updated.filter(f => f.song_id === feedbackSong.song_id);
    setSongFeedbacks(remaining);
    setFeedbackStats(calculateStats(remaining));
    setToast({ open: true, message: "Review deleted", severity: "info" });
    handleCloseFeedbackMenu();
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setFeedbackRating(feedback.rating);
    setFeedbackComment(feedback.comment);
    handleCloseFeedbackMenu();
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setFeedbackRating(5);
    setFeedbackComment("");
  };

  const handleLikeFeedback = (feedbackId) => {
    const userId = currentUser?.id || "guest";
    const all = getAllFeedbacks();
    const updated = all.map(f => {
      if (f.id === feedbackId) {
        const alreadyLiked = f.likedBy?.includes(userId);
        if (alreadyLiked) {
          return { ...f, likes: (f.likes || 0) - 1, likedBy: f.likedBy.filter(id => id !== userId) };
        } else {
          return { ...f, likes: (f.likes || 0) + 1, likedBy: [...(f.likedBy || []), userId] };
        }
      }
      return f;
    });
    localStorage.setItem("soundwave_song_feedbacks", JSON.stringify(updated));
    setSongFeedbacks(updated.filter(f => f.song_id === feedbackSong.song_id));
  };

  const handleOpenFeedbackMenu = (event, feedback) => {
    setFeedbackAnchorEl(event.currentTarget);
    setSelectedFeedbackMenu(feedback);
  };

  const handleCloseFeedbackMenu = () => {
    setFeedbackAnchorEl(null);
    setSelectedFeedbackMenu(null);
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Audio Player Engine Hooks
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (e, newValue) => {
    if (audioRef.current) {
      audioRef.current.volume = newValue;
      setVolume(newValue);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Dialog anchors
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchPublicSongs());
    dispatch(fetchPublicAlbums());
    dispatch(fetchPublicCategories());
    dispatch(fetchPublicArtists());

    // Register user details for cross-role lookup
    const user = authService.getUser();
    if (user && user.id) {
      const usersLookup = JSON.parse(localStorage.getItem("soundwave_users_lookup") || "{}");
      usersLookup[user.id] = { username: user.username, email: user.email };
      localStorage.setItem("soundwave_users_lookup", JSON.stringify(usersLookup));
    }
  }, [dispatch]);

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      (song.ArtistProfile?.stage_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? song.category_id === selectedCategory : true;
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

  const getAlbumSongs = (albumId) => songs.filter((song) => song.album_id === albumId);
  const getArtistSongs = (profileId) => songs.filter((song) => song.artist_profile_id === profileId);
  const getArtistAlbums = (profileId) => albums.filter((album) => album.artist_profile_id === profileId);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setArtistDialogOpen(true);
  };

  const getActiveQueue = () => {
    if (selectedPlaylist && activeTab === -1) return selectedPlaylist.songs;
    if (selectedAlbum && albumDialogOpen) return getAlbumSongs(selectedAlbum.album_id);
    if (selectedArtist && artistDialogOpen) return getArtistSongs(selectedArtist.artist_profile_id);
    return filteredSongs.length > 0 ? filteredSongs : songs;
  };

  const handleNext = () => {
    const queue = getActiveQueue();
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(s => s.song_id === currentSong?.song_id);
    if (currentIndex === -1) {
      setCurrentSong(queue[0]);
    } else {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentSong(queue[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const queue = getActiveQueue();
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(s => s.song_id === currentSong?.song_id);
    if (currentIndex === -1) {
      setCurrentSong(queue[0]);
    } else {
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentSong(queue[prevIndex]);
    }
  };

  // Reusable custom visual specs for inputs
  const inputStyles = {
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
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", pb: currentSong ? 12 : 0 }}>
        
        {/* --- Sidebar Left Navigation --- */}
        <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)" }}>
         

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => { setSelectedPlaylist(null); setActiveTab(0); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: (!selectedPlaylist && activeTab === 0) ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#FFFFFF",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#A2A0D5" }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => { setSelectedPlaylist(null); setActiveTab(4); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: (!selectedPlaylist && activeTab === 4) ? "rgba(1, 242, 234, 0.08)" : "transparent",
                  color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#FFFFFF",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#A2A0D5" }}><LibraryMusicIcon /></ListItemIcon>
                <ListItemText primary="Your Library" primaryTypographyProps={{ fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                <ListItemIcon sx={{ color: "#A2A0D5" }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            
            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
                <ListItemIcon sx={{ color: "#EF4444" }}><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "#EF4444", fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* --- Main Dashboard View Space --- */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          {/* Header Dashboard section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Welcome Back 👋</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Discover and listen to published artist music.</Typography>
            </Box>

            {/* Neon Search Box */}
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, py: 1, border: "1px solid rgba(162,160,213,0.2)", width: 320, "&:focus-within": { borderColor: "#01F2EA", boxShadow: "0 0 12px rgba(1,242,234,0.2)" } }}>
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <input
                type="text"
                placeholder="Search songs, albums, artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: "#FFFFFF", width: "100%", fontSize: 14 }}
              />
              {search && (
                <IconButton size="small" onClick={() => setSearch("")} sx={{ color: "text.secondary", p: 0.2 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Genres Chips */}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "#FFFFFF" }}>Categories / Genres</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
            <Chip
              label="All Genres"
              clickable
              onClick={() => setSelectedCategory(null)}
              sx={{ fontWeight: "bold", borderRadius: 2, bgcolor: selectedCategory === null ? "#01F2EA" : "rgba(255,255,255,0.05)", color: selectedCategory === null ? "#100B29" : "#FFFFFF", "&:hover": { bgcolor: selectedCategory === null ? "#00DDD5" : "rgba(255,255,255,0.1)" } }}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.category_id}
                label={cat.name}
                clickable
                onClick={() => setSelectedCategory(cat.category_id)}
                sx={{ fontWeight: "bold", borderRadius: 2, bgcolor: selectedCategory === cat.category_id ? "#01F2EA" : "rgba(255,255,255,0.05)", color: selectedCategory === cat.category_id ? "#100B29" : "#FFFFFF", "&:hover": { bgcolor: selectedCategory === cat.category_id ? "#00DDD5" : "rgba(255,255,255,0.1)" } }}
              />
            ))}
          </Box>

          {/* Navigation Tab Panel */}
          <Tabs
            value={(activeTab === -1 || activeTab === 4) ? false : activeTab}
            onChange={(e, val) => { setSelectedPlaylist(null); setActiveTab(val); }}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" } }}
          >
            <Tab label="Songs" icon={<MusicNoteIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
            <Tab label="Albums" icon={<AlbumIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
            <Tab label="Artists" icon={<PersonIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
            <Tab label="Playlists" icon={<QueueMusicIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* --- Playlist Detailed Workspace view --- */}
              {selectedPlaylist && activeTab === -1 && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, p: 3, borderRadius: 4, background: "linear-gradient(180deg, rgba(1,242,234,0.1) 0%, rgba(16,11,41,0) 100%)", border: "1px solid rgba(162,160,213,0.15)" }}>
                    <Box sx={{ width: 100, height: 100, borderRadius: 3, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(162,160,213,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <QueueMusicIcon sx={{ fontSize: 50, color: "#01F2EA" }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: "bold", color: "#CE04F2", letterSpacing: "1px" }}>Playlist</Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 0.5, mb: 1, color: "#FFFFFF" }}>{selectedPlaylist.name}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{selectedPlaylist.songs.length} tracks • Created by You</Typography>
                    </Box>
                    <Button variant="outlined" color="error" size="small" onClick={() => { if (window.confirm("Delete playlist?")) { const updated = playlists.filter(p => p.id !== selectedPlaylist.id); savePlaylists(updated); setSelectedPlaylist(null); setActiveTab(0); } }} sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}>
                      Delete Playlist
                    </Button>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>Tracks</Typography>
                  {selectedPlaylist.songs.length === 0 ? (
                    <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                      <Typography sx={{ color: "text.secondary" }}>This playlist has no songs yet.</Typography>
                    </Card>
                  ) : (
                    <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                      {selectedPlaylist.songs.map((song, idx) => (
                        <Box key={song.song_id} onClick={() => setCurrentSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: idx < selectedPlaylist.songs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, cursor: "pointer" }}>
                          <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>{idx + 1}</Typography>
                          <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, overflow: "hidden" }}>
                            {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: "600", fontSize: "0.9rem", color: "#FFFFFF" }}>{song.title}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>{song.ArtistProfile?.stage_name || "Unknown Artist"}</Typography>
                          </Box>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); const updated = playlists.map(p => p.id === selectedPlaylist.id ? { ...p, songs: p.songs.filter(s => s.song_id !== song.song_id) } : p); savePlaylists(updated); setSelectedPlaylist(updated.find(p => p.id === selectedPlaylist.id)); }} sx={{ color: "text.secondary", mr: 2, "&:hover": { color: "#EF4444" } }}>
                            <ClearIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#01F2EA" }}><PlayCircleFilledIcon sx={{ fontSize: 28 }} /></IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Tab 0: Songs Grid Display */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>Dynamic Library</Typography>
                  {filteredSongs.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No songs found.</Typography></Card>
                  ) : (
                    <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                      {filteredSongs.map((song, idx) => (
                        <Box key={song.song_id} onClick={() => setCurrentSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: idx < filteredSongs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, cursor: "pointer" }}>
                          <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>{idx + 1}</Typography>
                          <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, overflow: "hidden" }}>
                            {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{song.title}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{song.ArtistProfile?.stage_name || "Unknown Artist"}</Typography>
                          </Box>
                          {song.Category?.name && <Chip label={song.Category.name} size="small" sx={{ mr: 3, bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />}
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleLikeSong(song); }} sx={{ color: likedSongs.some(s => s.song_id === song.song_id) ? "#CE04F2" : "text.secondary", mr: 1 }}>
                            {likedSongs.some(s => s.song_id === song.song_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </IconButton>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); downloadSong(song); }} sx={{ color: downloadedSongs.some(s => s.song_id === song.song_id) ? "#01F2EA" : "text.secondary", mr: 1 }}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSongToAddToPlaylist(song); setAddToPlaylistOpen(true); }} sx={{ color: "text.secondary", mr: 1 }}><PlaylistAddIcon /></IconButton>
                          <IconButton size="small" sx={{ color: "#01F2EA" }}><PlayCircleFilledIcon sx={{ fontSize: 32 }} /></IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Tab 1: Albums UI Cards - COMPACT SMALL SIZE (5-6 per row) */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Available Albums</Typography>
                  {filteredAlbums.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No albums found.</Typography></Card>
                  ) : (
                    <Grid container spacing={2}>
                      {filteredAlbums.map((album) => (
                        <Grid item xs={3} sm={3} md={3} lg={3} key={album.album_id}>
                          <Card onClick={() => handleAlbumClick(album)} sx={{ height: "100%", maxWidth: 120, display: "flex", flexDirection: "column", borderRadius: 2, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-4px)", borderColor: "#01F2EA", boxShadow: "0 0 15px rgba(1,242,234,0.2)" } }}>
                            <Box sx={{ aspectRatio: "1/1", width: "100%", bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                              {album.cover_image ? <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 32 }} />}
                            </Box>
                            <CardContent sx={{ p: 0.8, "&:last-child": { pb: 0.8 } }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFFFFF", fontSize: "0.9rem" }}>{album.title}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.75rem" }}>{album.ArtistProfile?.stage_name || "Unknown"}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Tab 2: Artists Rounded Profiles */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Featured Artists</Typography>
                  {filteredArtists.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No artists found.</Typography></Card>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredArtists.map((artist) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={artist.artist_profile_id}>
                          <Card onClick={() => handleArtistClick(artist)} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", p: 2.5, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-4px)", borderColor: "#CE04F2", boxShadow: "0 0 15px rgba(206,4,242,0.2)" } }}>
                            <Box sx={{ width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(162,160,213,0.2)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                              {artist.profile_image ? <Box component="img" src={artist.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <PersonIcon sx={{ color: "#01F2EA", fontSize: 44 }} />}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{artist.stage_name}</Typography>
                            {artist.is_verified && <Chip label="Verified" size="small" color="primary" sx={{ mt: 1, height: 18, fontSize: "10px" }} />}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Tab 3: Playlists Deck Grid */}
              {activeTab === 3 && (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Your Playlists</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreatePlaylistOpen(true)} sx={{ borderRadius: 3, fontWeight: "bold", textTransform: "none", bgcolor: "#01F2EA", color: "#100B29", "&:hover": { bgcolor: "#00DDD5" } }}>
                      Create Playlist
                    </Button>
                  </Box>
                  {playlists.length === 0 ? (
                    <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No playlists created yet.</Typography></Card>
                  ) : (
                    <Grid container spacing={3}>
                      {playlists.map((playlist) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={playlist.id}>
                          <Card onClick={() => { setSelectedPlaylist(playlist); setActiveTab(-1); }} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer", transition: "all 0.2s", "&:hover": { borderColor: "#01F2EA" } }}>
                            <Box sx={{ aspectRatio: "1/1", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.02)" }}>
                              <QueueMusicIcon sx={{ color: "#01F2EA", fontSize: 44 }} />
                            </Box>
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{playlist.name}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>{playlist.songs.length} tracks</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Tab 4: Complex Interactive Library System Section */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Your Library</Typography>
                  <Tabs value={libraryTab} onChange={(e, val) => setLibraryTab(val)} textColor="primary" indicatorColor="primary" sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" } }}>
                    <Tab label="Liked Songs" icon={<FavoriteIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
                    <Tab label="Saved Albums" icon={<AlbumIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
                    <Tab label="Followed Artists" icon={<PersonIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
                    <Tab label="Downloads" icon={<DownloadIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
                  </Tabs>

                  {libraryTab === 0 && (
                    <Box>
                      {likedSongs.length === 0 ? (
                        <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No liked songs yet.</Typography></Card>
                      ) : (
                        <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                          {likedSongs.map((song, idx) => (
                            <Box key={song.song_id} onClick={() => setCurrentSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: idx < likedSongs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, cursor: "pointer" }}>
                              <Typography sx={{ color: "text.secondary", width: 30 }}>{idx + 1}</Typography>
                              <Box sx={{ width: 40, height: 40, mr: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, overflow: "hidden" }}>
                                {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}><Typography sx={{ fontWeight: "600", color: "#FFFFFF" }}>{song.title}</Typography></Box>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleLikeSong(song); }} sx={{ color: "#CE04F2" }}><FavoriteIcon /></IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Saved Albums - COMPACT SMALL SIZE (5-6 per row) */}
                  {libraryTab === 1 && (
                    <Box>
                      {savedAlbums.length === 0 ? (
                        <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                          <Typography sx={{ color: "text.secondary" }}>No saved albums yet.</Typography>
                        </Card>
                      ) : (
                        <Grid container spacing={1}>
                          {savedAlbums.map((album) => (
                            <Grid item xs={3} sm={3} md={3} lg={3} key={album.album_id}>
                              <Card onClick={() => handleAlbumClick(album)} sx={{ height: "100%", maxWidth: 120, display: "flex", flexDirection: "column", borderRadius: 2, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-4px)", borderColor: "#01F2EA", boxShadow: "0 0 15px rgba(1,242,234,0.2)" } }}>
                                <Box sx={{ aspectRatio: "1/1", width: "100%", bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                                  {album.cover_image ? <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 32 }} />}
                                </Box>
                                <CardContent sx={{ p: 0.8, "&:last-child": { pb: 0.8 } }}>
                                  <Typography variant="body2" sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFFFFF", fontSize: "0.78rem" }}>{album.title}</Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.75rem" }}>{album.ArtistProfile?.stage_name || "Unknown"}</Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  )}

                  {libraryTab === 2 && (
                    <Grid container spacing={3}>
                      {followedArtists.map((art) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={art.artist_profile_id}>
                          <Card onClick={() => handleArtistClick(art)} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer" }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", mb: 1 }}><Box component="img" src={art.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{art.stage_name}</Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {libraryTab === 3 && (
                    <Box>
                      {downloadedSongs.map((song) => (
                        <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, bgcolor: "background.paper", borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                          <Box sx={{ flexGrow: 1 }}><Typography sx={{ color: "#FFFFFF", fontWeight: "600" }}>{song.title}</Typography></Box>
                          <Button size="small" color="error" onClick={() => removeDownloadedSong(song.song_id)}>Remove</Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* --- Album Songs Dialog Frame Window --- */}
      <Dialog open={albumDialogOpen} onClose={() => setAlbumDialogOpen(false)} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => setAlbumDialogOpen(false)} sx={{ color: "text.secondary" }}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{selectedAlbum?.title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
            <Box sx={{ width: 140, height: 140, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.2)" }}>
              <Box component="img" src={selectedAlbum?.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>{selectedAlbum?.description || "No description available."}</Typography>
              <Button variant="outlined" startIcon={<BookmarkIcon />} onClick={() => toggleSaveAlbum(selectedAlbum)} sx={{ borderColor: "#01F2EA", color: "#01F2EA" }}>
                {savedAlbums.some(a => a.album_id === selectedAlbum?.album_id) ? "Saved" : "Save Album"}
              </Button>
            </Box>
          </Box>
          <Box sx={{ bgcolor: "rgba(255,255,255,0.02)", borderRadius: 3, overflow: "hidden" }}>
            {selectedAlbum && getAlbumSongs(selectedAlbum.album_id).map((song, idx) => (
              <Box key={song.song_id} onClick={() => { setCurrentSong(song); setAlbumDialogOpen(false); }} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, cursor: "pointer" }}>
                <Typography sx={{ color: "text.secondary", mr: 2 }}>{idx + 1}</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "600", flexGrow: 1 }}>{song.title}</Typography>
                <PlayCircleFilledIcon sx={{ color: "#01F2EA" }} />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* --- Artist Dialog Workspace --- */}
      <Dialog open={artistDialogOpen} onClose={() => setArtistDialogOpen(false)} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => setArtistDialogOpen(false)} sx={{ color: "text.secondary" }}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{selectedArtist?.stage_name}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 4 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden" }}><Box component="img" src={selectedArtist?.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>{selectedArtist?.bio || "No biography details."}</Typography>
              <Button variant="contained" onClick={() => toggleFollowArtist(selectedArtist)} sx={{ bgcolor: "#CE04F2", color: "#FFF", "&:hover": { bgcolor: "#B003D4" } }}>
                {followedArtists.some(a => a.artist_profile_id === selectedArtist?.artist_profile_id) ? "Following" : "Follow Artist"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* --- Sticky Media Controller Dashboard Frame --- */}
      {currentSong && (
        <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 95, bgcolor: "#140E34", borderTop: "2px solid rgba(1, 242, 234, 0.3)", display: "flex", alignItems: "center", px: 4, justifyContent: "space-between", zIndex: 1100, boxShadow: "0 -4px 20px rgba(1,242,234,0.15)" }}>
          <audio ref={audioRef} src={`http://localhost:5000/uploads/${currentSong.audio_file}`} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleNext} />
          
          {/* Left Column Track Details */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 240 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(162,160,213,0.2)" }}>
              {currentSong.cover_image ? <Box component="img" src={currentSong.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA", m: 2 }} />}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentSong.title}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentSong.ArtistProfile?.stage_name || "Unknown Artist"}</Typography>
            </Box>
            <IconButton onClick={() => toggleLikeSong(currentSong)} sx={{ color: likedSongs.some(s => s.song_id === currentSong.song_id) ? "#CE04F2" : "text.secondary" }}>
              {likedSongs.some(s => s.song_id === currentSong.song_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          {/* Central Progress Dashboard Slider and buttons */}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, maxWidth: 600 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={handlePrevious} sx={{ color: "text.secondary" }}><SkipPreviousIcon /></IconButton>
              <IconButton onClick={togglePlay} sx={{ bgcolor: "#01F2EA", color: "#100B29", "&:hover": { bgcolor: "#00DDD5" }, width: 38, height: 38 }}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton onClick={handleNext} sx={{ color: "text.secondary" }}><SkipNextIcon /></IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{formatTime(currentTime)}</Typography>
              <Slider size="small" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} sx={{ color: "#01F2EA" }} />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{formatTime(duration)}</Typography>
            </Box>
          </Box>

          {/* Right Column Utilities (Volume, Review Dialogue triggers) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200, justifyContent: "flex-end" }}>
            <VolumeUpIcon sx={{ color: "text.secondary" }} />
            <Slider size="small" min={0} max={1} step={0.01} value={volume} onChange={handleVolumeChange} sx={{ width: 90, color: "#FFFFFF" }} />
            <IconButton onClick={() => { setFeedbackSong(currentSong); setFeedbackOpen(true); }} sx={{ color: "text.secondary", "&:hover": { color: "#CE04F2" } }}><CommentIcon /></IconButton>
            <IconButton onClick={() => setCurrentSong(null)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
          </Box>
        </Box>
      )}

      {/* --- Action Dialog: Form Modals Forms --- */}
      <Dialog open={createPlaylistOpen} onClose={() => setCreatePlaylistOpen(false)} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Create Playlist</DialogTitle>
        <Box component="form" onSubmit={handleCreatePlaylist}>
          <DialogContent><TextField fullWidth label="Playlist Name" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} required variant="outlined" sx={inputStyles} /></DialogContent>
          <DialogActions sx={{ p: 2.5 }}><Button onClick={() => setCreatePlaylistOpen(false)} sx={{ color: "text.secondary" }}>Cancel</Button><Button type="submit" variant="contained" sx={{ bgcolor: "#01F2EA", color: "#100B29" }}>Create</Button></DialogActions>
        </Box>
      </Dialog>

      <Dialog open={addToPlaylistOpen} onClose={() => setAddToPlaylistOpen(false)} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Add to Playlist</DialogTitle>
        <DialogContent>
          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {playlists.map((pl) => (
              <ListItem key={pl.id} disablePadding>
                <ListItemButton onClick={() => handleAddSongToPlaylist(pl.id)} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(162,160,213,0.1)", "&:hover": { borderColor: "#01F2EA" } }}>
                  <QueueMusicIcon sx={{ color: "#01F2EA", mr: 2 }} />
                  <ListItemText primary={pl.name} secondary={`${pl.songs.length} tracks`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* --- ENHANCED REVIEWS & COMMENTS DIALOG --- */}
      <Dialog 
        open={feedbackOpen} 
        onClose={() => { setFeedbackOpen(false); setEditingFeedback(null); setFeedbackComment(""); setFeedbackRating(5); }} 
        fullWidth 
        maxWidth="md" 
        slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)", maxHeight: "90vh" } } }}
      >
        {/* Dialog Header with Song Info */}
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            pb: 2,
            background: "linear-gradient(135deg, rgba(1,242,234,0.08) 0%, rgba(206,4,242,0.05) 100%)",
            borderBottom: "1px solid rgba(162,160,213,0.15)"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <IconButton 
                onClick={() => { setFeedbackOpen(false); setEditingFeedback(null); setFeedbackComment(""); setFeedbackRating(5); }} 
                sx={{ color: "text.secondary", "&:hover": { color: "#01F2EA" } }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                Reviews & Comments
              </Typography>
            </Box>

            {/* Song Info Card */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, ml: 1 }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: 2, 
                overflow: "hidden", 
                border: "1px solid rgba(162,160,213,0.2)",
                flexShrink: 0
              }}>
                {feedbackSong?.cover_image ? (
                  <Box component="img" src={feedbackSong.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.03)" }}>
                    <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 28 }} />
                  </Box>
                )}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", fontSize: "1.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {feedbackSong?.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {feedbackSong?.ArtistProfile?.stage_name || "Unknown Artist"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 0, display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Rating Stats Dashboard */}
          {feedbackStats.total > 0 && (
            <Box sx={{ 
              py: 3, 
              borderBottom: "1px solid rgba(162,160,213,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}>
              {/* Average Score */}
              <Box sx={{ textAlign: "center", minWidth: 100 }}>
                <Typography variant="h2" sx={{ fontWeight: "bold", color: "#01F2EA", lineHeight: 1 }}>
                  {feedbackStats.average}
                </Typography>
                <Rating 
                  value={parseFloat(feedbackStats.average)} 
                  precision={0.1} 
                  readOnly 
                  size="small"
                  sx={{ 
                    color: "#01F2EA",
                    "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.3)" }
                  }}
                />
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                  {feedbackStats.total} review{feedbackStats.total !== 1 ? "s" : ""}
                </Typography>
              </Box>

              {/* Rating Distribution Bars */}
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.8 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = feedbackStats.distribution[star - 1] || 0;
                  const percentage = feedbackStats.total > 0 ? (count / feedbackStats.total) * 100 : 0;
                  return (
                    <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", width: 20, textAlign: "right", fontSize: "0.75rem" }}>
                        {star}
                      </Typography>
                      <StarIcon sx={{ color: "#01F2EA", fontSize: 14 }} />
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: "rgba(162,160,213,0.1)", borderRadius: 3, overflow: "hidden" }}>
                        <Box sx={{ 
                          width: `${percentage}%`, 
                          height: "100%", 
                          bgcolor: star >= 4 ? "#01F2EA" : star === 3 ? "#A2A0D5" : "#EF4444",
                          borderRadius: 3,
                          transition: "width 0.5s ease"
                        }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", width: 30, fontSize: "0.75rem" }}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Write Review Section */}
          <Box sx={{ py: 3, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 2 }}>
              {editingFeedback ? "Edit Your Review" : "Write a Review"}
            </Typography>
            <Box component="form" onSubmit={handleSubmitFeedback} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Your Rating:</Typography>
                <Rating
                  value={feedbackRating}
                  onChange={(e, val) => setFeedbackRating(val || 1)}
                  size="large"
                  sx={{ 
                    color: "#01F2EA",
                    "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.3)" }
                  }}
                />
                <Typography variant="body2" sx={{ color: "#01F2EA", fontWeight: "bold", ml: 1 }}>
                  {feedbackRating}/5
                </Typography>
              </Box>
              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                placeholder="Share your thoughts about this song..."
                value={feedbackComment} 
                onChange={(e) => setFeedbackComment(e.target.value)} 
                required 
                sx={{
                  ...inputStyles,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyles["& .MuiOutlinedInput-root"],
                    bgcolor: "rgba(255,255,255,0.03)",
                    borderRadius: 3
                  }
                }}
              />
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                {editingFeedback && (
                  <Button 
                    onClick={handleCancelEdit} 
                    sx={{ color: "text.secondary", textTransform: "none", fontWeight: "bold" }}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant="contained" 
                  endIcon={<SendIcon />}
                  disabled={!feedbackComment.trim()}
                  sx={{ 
                    bgcolor: "#01F2EA", 
                    color: "#100B29", 
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 3,
                    "&:hover": { bgcolor: "#00DDD5" },
                    "&:disabled": { bgcolor: "rgba(1,242,234,0.3)", color: "rgba(16,11,41,0.5)" }
                  }}
                >
                  {editingFeedback ? "Update Review" : "Post Review"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Reviews List Header with Sort/Filter */}
          <Box sx={{ 
            py: 2, 
            borderBottom: "1px solid rgba(162,160,213,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              All Reviews ({getSortedAndFilteredFeedbacks().length})
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button 
                size="small" 
                onClick={() => setFeedbackFilter(feedbackFilter === "all" ? "mine" : "all")}
                sx={{ 
                  textTransform: "none", 
                  fontWeight: "bold",
                  color: feedbackFilter === "mine" ? "#01F2EA" : "text.secondary",
                  borderRadius: 2,
                  border: feedbackFilter === "mine" ? "1px solid #01F2EA" : "1px solid rgba(162,160,213,0.2)",
                  px: 1.5
                }}
              >
                {feedbackFilter === "mine" ? "My Reviews" : "All Reviews"}
              </Button>
              <Button 
                size="small" 
                onClick={() => {
                  const sorts = ["newest", "highest", "lowest"];
                  const currentIdx = sorts.indexOf(feedbackSortBy);
                  setFeedbackSortBy(sorts[(currentIdx + 1) % sorts.length]);
                }}
                sx={{ 
                  textTransform: "none", 
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderRadius: 2,
                  border: "1px solid rgba(162,160,213,0.2)",
                  px: 1.5
                }}
              >
                Sort: {feedbackSortBy === "newest" ? "Newest" : feedbackSortBy === "highest" ? "Highest Rated" : "Lowest Rated"}
              </Button>
            </Box>
          </Box>

          {/* Reviews List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: "50vh", overflowY: "auto", py: 1 }}>
            {getSortedAndFilteredFeedbacks().length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <CommentIcon sx={{ color: "rgba(162,160,213,0.2)", fontSize: 48, mb: 2 }} />
                <Typography sx={{ color: "text.secondary" }}>
                  {feedbackFilter === "mine" ? "You haven't reviewed this song yet." : "No reviews yet. Be the first to share your thoughts!"}
                </Typography>
              </Box>
            ) : (
              getSortedAndFilteredFeedbacks().map((f) => (
                <Fade key={f.id} in={true} timeout={300}>
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 3, 
                    bgcolor: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(162,160,213,0.08)",
                    mb: 1.5,
                    transition: "all 0.2s",
                    "&:hover": { 
                      bgcolor: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(162,160,213,0.15)"
                    }
                  }}>
                    {/* Review Header */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: f.user_id === currentUser?.id ? "#01F2EA" : "#CE04F2",
                            color: "#100B29",
                            fontWeight: "bold",
                            fontSize: "0.9rem"
                          }}
                        >
                          {f.username?.charAt(0).toUpperCase() || "?"}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                              {f.username}
                            </Typography>
                            {f.user_id === currentUser?.id && (
                              <Chip label="You" size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: "rgba(1,242,234,0.15)", color: "#01F2EA", fontWeight: "bold" }} />
                            )}
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Rating value={f.rating} readOnly size="small" sx={{ color: "#01F2EA", "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.2)" } }} />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {formatRelativeTime(f.timestamp)}
                              {f.edited && <span style={{ fontStyle: "italic", marginLeft: 4 }}>(edited)</span>}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Review Actions Menu */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Tooltip title="Like this review">
                          <IconButton 
                            size="small" 
                            onClick={() => handleLikeFeedback(f.id)}
                            sx={{ 
                              color: f.likedBy?.includes(currentUser?.id || "guest") ? "#CE04F2" : "text.secondary",
                              "&:hover": { color: "#CE04F2" }
                            }}
                          >
                            <FavoriteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 16 }}>
                          {f.likes || 0}
                        </Typography>
                        {f.user_id === currentUser?.id && (
                          <>
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleOpenFeedbackMenu(e, f)}
                              sx={{ color: "text.secondary", ml: 0.5 }}
                            >
                              <MoreVertIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Review Content */}
                    <Typography variant="body2" sx={{ color: "#FFFFFF", lineHeight: 1.6, pl: 0.5 }}>
                      {f.comment}
                    </Typography>
                  </Box>
                </Fade>
              ))
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Review Actions Menu */}
      <Menu
        anchorEl={feedbackAnchorEl}
        open={Boolean(feedbackAnchorEl)}
        onClose={handleCloseFeedbackMenu}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1A153A",
              border: "1px solid rgba(162,160,213,0.2)",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
            }
          }
        }}
      >
        <MenuItem 
          onClick={() => selectedFeedbackMenu && handleEditFeedback(selectedFeedbackMenu)}
          sx={{ color: "#FFFFFF", "&:hover": { bgcolor: "rgba(1,242,234,0.1)" }, gap: 1.5, px: 2, py: 1 }}
        >
          <EditIcon sx={{ fontSize: 18, color: "#01F2EA" }} />
          Edit Review
        </MenuItem>
        <MenuItem 
          onClick={() => selectedFeedbackMenu && handleDeleteFeedback(selectedFeedbackMenu.id)}
          sx={{ color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" }, gap: 1.5, px: 2, py: 1 }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
          Delete Review
        </MenuItem>
      </Menu>

      {/* Dynamic Feedback Toast Messages Popup */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}