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
  Snackbar, Avatar, Rating, Tooltip, Fade, Paper, Menu, MenuItem,
  Badge, Switch
} from "@mui/material";
import {
  Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon,
  QueueMusic as QueueMusicIcon, Person as PersonIcon, MusicNote as MusicNoteIcon,
  PlayCircleFilled as PlayCircleFilledIcon, ExitToApp as ExitToAppIcon,
  Album as AlbumIcon, Close as CloseIcon, Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon, Pause as PauseIcon,
  SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon,
  VolumeUp as VolumeUpIcon, Add as AddIcon, PlaylistAdd as PlaylistAddIcon, Comment as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon, Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon,
  GetApp as DownloadIcon, LibraryMusic as LibraryMusicIcon,
  MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon,
  Star as StarIcon, StarBorder as StarBorderIcon, Send as SendIcon,
  Notifications as NotificationsIcon, Settings as SettingsIcon,
  Facebook as FacebookIcon, Instagram as InstagramIcon, YouTube as YouTubeIcon, Language as WebIcon
} from "@mui/icons-material";
import authService from "../../services/authService";
import api from "../../api";
import {
  fetchPublicSongs,
  fetchPublicAlbums,
  fetchPublicCategories,
  fetchPublicArtists,
  loadListenerState,
  fetchRecentlyPlayed,
  recordSongPlay,
  setPlaylists,
  toggleLikeSong as reduxToggleLikeSong,
  toggleSaveAlbum as reduxToggleSaveAlbum,
  toggleFollowArtist as reduxToggleFollowArtist,
  downloadSong as reduxDownloadSong,
  removeDownloadedSong as reduxRemoveDownloadedSong,
  registerUserLookup,
  submitFeedback,
  editFeedbackThunk,
  removeFeedbackThunk,
  toggleLikeFeedbackThunk,
  updateNotificationSettings,
  addNotification,
  markNotificationsRead,
  clearNotifications
} from "../../features/catalog/catalogSlice";
import SongSlider from "../../components/Listener/SongSlider";
import ListenerSidebar from "../../components/Listener/ListenerSidebar";
import ListenerHeader from "../../components/Listener/ListenerHeader";
import ListenerLibrary from "../../components/Listener/ListenerLibrary";
import ListenerHome from "../../components/Listener/ListenerHome";
import CategoryFilter from "../../components/Listener/CategoryFilter";
import NavigationTabs from "../../components/Listener/NavigationTabs";
import PlaylistDetailView from "../../components/Listener/PlaylistDetailView";
import ListenerNotificationSettings from "../../components/Listener/ListenerNotificationSettings";
import AlbumDialog from "../../components/Listener/AlbumDialog";
import ArtistDialog from "../../components/Listener/ArtistDialog";
import CreatePlaylistDialog from "../../components/Listener/CreatePlaylistDialog";
import AddToPlaylistDialog from "../../components/Listener/AddToPlaylistDialog";
import FeedbackMenu from "../../components/Listener/FeedbackMenu";
import MusicPlayer from "../../components/Listener/MusicPlayer";
import ReviewsDialog from "../../components/Listener/ReviewsDialog";

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
  const {
    songs,
    albums,
    categories,
    artists,
    playlistsMap,
    likedSongsMap,
    savedAlbumsMap,
    followedArtistsMap,
    downloadedSongsMap,
    usersLookup,
    feedbacks,
    recentlyPlayed,
    notificationSettingsMap = {},
    notificationsMap = {},
    loading,
    error
  } = useSelector((state) => state.catalog);

  const user = useSelector((state) => state.auth.user) || {};
  const userId = user.id || "guest";

  const notificationSettings = notificationSettingsMap[userId] || { enabled: true, newSong: true, newAlbum: true };
  const notifications = notificationsMap[userId] || [];
  const activeNotifications = notifications.filter(n => !n.cleared);



  // Component State
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [currentSong, setCurrentSong] = useState(null); 

  // Playlist State
  const playlists = playlistsMap[userId] || [];
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); 

  // Dialog & Form states
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState(null);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const savePlaylists = (newPlaylists) => {
    dispatch(setPlaylists({ userId, playlists: newPlaylists }));
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
  const likedSongs = likedSongsMap[userId] || [];
  const savedAlbums = savedAlbumsMap[userId] || [];
  const followedArtists = followedArtistsMap[userId] || [];
  const downloadedSongs = downloadedSongsMap[userId] || [];



  const toggleLikeSong = (song) => {
    dispatch(reduxToggleLikeSong({ userId, song }));
  };

  const toggleSaveAlbum = (album) => {
    dispatch(reduxToggleSaveAlbum({ userId, album }));
  };

  const toggleFollowArtist = (artist) => {
    dispatch(reduxToggleFollowArtist({ userId, artist }));
  };

  const downloadSong = (song) => {
    if (downloadedSongs.some(s => s.song_id === song.song_id)) {
      return;
    }
    dispatch(reduxDownloadSong({ userId, song }));
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
  };

  const removeDownloadedSong = (songId) => {
    dispatch(reduxRemoveDownloadedSong({ userId, songId }));
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

  // ===== SPRINT 4 CONTENT DISCOVERY & REPORTING =====
  const [sort, setSort] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSong, setReportSong] = useState(null);
  const [reportReason, setReportReason] = useState("");

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || !reportSong) return;
    try {
      await api.post("/moderator/reports", {
        target_type: "song",
        target_id: String(reportSong.song_id),
        reason: reportReason.trim()
      });
      setToast({ open: true, message: `Report for "${reportSong.title}" submitted successfully.`, severity: "success" });
      setReportOpen(false);
      setReportReason("");
      setReportSong(null);
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || "Failed to submit report", severity: "error" });
    }
  };

  const currentUser = user;

  const getAllFeedbacks = () => {
    return feedbacks || [];
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
      const all = feedbacks || [];
      const filtered = all.filter(f => f.song_id === feedbackSong.song_id);
      setSongFeedbacks(filtered);
      setFeedbackStats(calculateStats(filtered));
    }
  }, [feedbackSong, feedbackOpen, feedbacks]);

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

    if (editingFeedback) {
      // Update existing review
      dispatch(editFeedbackThunk({ id: editingFeedback.id, rating: feedbackRating, comment: feedbackComment.trim() }));
      setToast({ open: true, message: "Review updated successfully!", severity: "success" });
      setEditingFeedback(null);
    } else {
      // Create new review
      dispatch(submitFeedback({
        song_id: feedbackSong.song_id,
        rating: feedbackRating,
        comment: feedbackComment.trim()
      }));
      setToast({ open: true, message: "Review posted successfully!", severity: "success" });
    }

    setFeedbackComment("");
    setFeedbackRating(5);
  };

  const handleDeleteFeedback = (feedbackId) => {
    dispatch(removeFeedbackThunk(feedbackId));
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
    dispatch(toggleLikeFeedbackThunk({ feedbackId, userId }));
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
        .then(() => {
          setIsPlaying(true);
          dispatch(recordSongPlay(currentSong.song_id)).then(() => {
            dispatch(fetchRecentlyPlayed());
          });
        })
        .catch(err => console.error(err));
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentSong, dispatch]);

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
    dispatch(fetchPublicCategories());

    // Register user details for cross-role lookup
    if (user && user.id) {
      dispatch(registerUserLookup({ userId: user.id, username: user.username, email: user.email }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId && userId !== "guest") {
      dispatch(loadListenerState(userId));
      dispatch(fetchRecentlyPlayed());
    }
  }, [userId, dispatch]);

  // Debounced search & category trigger for server-side database filtering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchPublicSongs({ search, category: selectedCategory, sort, duration: durationFilter }));
      dispatch(fetchPublicAlbums({ search }));
      dispatch(fetchPublicArtists({ search }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, sort, durationFilter, dispatch]);

  // Check for new releases from followed artists to trigger push notifications
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const followedIds = followedArtists.map((a) => a.artist_profile_id);

    // 1. Check Songs
    if (notificationSettings.newSong) {
      songs.forEach((song) => {
        if (followedIds.includes(song.artist_profile_id)) {
          const artistName = song.ArtistProfile?.stage_name || "Followed Artist";
          const alreadyNotified = notifications.some(
            (n) => n.type === "song" && n.targetId === song.song_id
          );
          if (!alreadyNotified) {
            dispatch(
              addNotification({
                userId,
                notification: {
                  id: "notif_song_" + song.song_id,
                  type: "song",
                  targetId: song.song_id,
                  title: "New Song Released!",
                  message: `${artistName} released a new song: "${song.title}"`,
                  timestamp: new Date().toISOString(),
                  read: false,
                },
              })
            );
            setToast({
              open: true,
              message: `🎵 New Release: ${artistName} released "${song.title}"!`,
              severity: "info",
            });
          }
        }
      });
    }
    // 2. Check Albums
    if (notificationSettings.newAlbum) {
      albums.forEach((album) => {
        if (followedIds.includes(album.artist_profile_id)) {
          const artistName = album.ArtistProfile?.stage_name || "Followed Artist";
          const alreadyNotified = notifications.some(
            (n) => n.type === "album" && n.targetId === album.album_id
          );
          if (!alreadyNotified) {
            dispatch(
              addNotification({
                userId,
                notification: {
                  id: "notif_album_" + album.album_id,
                  type: "album",
                  targetId: album.album_id,
                  title: "New Album Released!",
                  message: `${artistName} released a new album: "${album.title}"`,
                  timestamp: new Date().toISOString(),
                  read: false,
                },
              })
            );
            setToast({
              open: true,
              message: `💿 New Release: ${artistName} released album "${album.title}"!`,
              severity: "info",
            });
          }
        }
      });
    }
  }, [songs, albums, followedArtists, notificationSettings, notifications, userId, dispatch]);

  const filteredSongs = songs;
  const filteredAlbums = albums;
  const filteredArtists = artists;

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
        <ListenerSidebar 
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        {/* --- Main Dashboard View Space --- */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto", backgroundImage: "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
          
          {/* Header Dashboard section */}
          <ListenerHeader
            userId={userId}
            activeNotifications={activeNotifications}
            songs={songs}
            albums={albums}
            setCurrentSong={setCurrentSong}
            setIsPlaying={setIsPlaying}
            handleAlbumClick={handleAlbumClick}
            search={search}
            setSearch={setSearch}
          />

          {!selectedPlaylist && activeTab !== 4 && activeTab !== 5 && (
            <>
              {/* Genres Chips */}
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              {/* Navigation Tab Panel */}
              <NavigationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setSelectedPlaylist={setSelectedPlaylist}
              />
            </>
          )}

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* --- Playlist Detailed Workspace view --- */}
              {selectedPlaylist && activeTab === -1 && (
                <PlaylistDetailView
                  selectedPlaylist={selectedPlaylist}
                  setSelectedPlaylist={setSelectedPlaylist}
                  playlists={playlists}
                  savePlaylists={savePlaylists}
                  setActiveTab={setActiveTab}
                  artists={artists}
                  handleArtistClick={handleArtistClick}
                  setCurrentSong={setCurrentSong}
                />
              )}

              {/* Tab 0: Songs Grid Display */}
              {activeTab === 0 && (
                <ListenerHome
                  songs={songs}
                  filteredSongs={filteredSongs}
                  currentSong={currentSong}
                  setCurrentSong={setCurrentSong}
                  artists={artists}
                  handleArtistClick={handleArtistClick}
                  likedSongs={likedSongs}
                  toggleLikeSong={toggleLikeSong}
                  downloadedSongs={downloadedSongs}
                  downloadSong={downloadSong}
                  setSongToAddToPlaylist={setSongToAddToPlaylist}
                  setAddToPlaylistOpen={setAddToPlaylistOpen}
                  setReportSong={setReportSong}
                  setReportOpen={setReportOpen}
                  sort={sort}
                  setSort={setSort}
                  duration={durationFilter}
                  setDuration={setDurationFilter}
                />
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
                              <Typography
                                variant="caption"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const artistObj = artists.find(a => a.artist_profile_id === album.artist_profile_id);
                                  if (artistObj) handleArtistClick(artistObj);
                                }}
                                sx={{
                                  color: "text.secondary",
                                  display: "inline-block",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  "&:hover": { color: "#01F2EA", textDecoration: "underline" }
                                }}
                              >
                                {album.ArtistProfile?.stage_name || "Unknown"}
                              </Typography>
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
                <ListenerLibrary
                  likedSongs={likedSongs}
                  savedAlbums={savedAlbums}
                  followedArtists={followedArtists}
                  downloadedSongs={downloadedSongs}
                  recentlyPlayed={recentlyPlayed}
                  toggleLikeSong={toggleLikeSong}
                  toggleSaveAlbum={toggleSaveAlbum}
                  toggleFollowArtist={toggleFollowArtist}
                  removeDownloadedSong={removeDownloadedSong}
                  handleAlbumClick={handleAlbumClick}
                  handleArtistClick={handleArtistClick}
                  setCurrentSong={setCurrentSong}
                  artists={artists}
                />
              )}

              {activeTab === 5 && (
                <ListenerNotificationSettings
                  userId={userId}
                  notificationSettings={notificationSettings}
                />
              )}
            </>
          )}
        </Box>
      </Box>

      {/* --- Album Songs Dialog Frame Window --- */}
      <AlbumDialog
        albumDialogOpen={albumDialogOpen}
        setAlbumDialogOpen={setAlbumDialogOpen}
        selectedAlbum={selectedAlbum}
        artists={artists}
        handleArtistClick={handleArtistClick}
        toggleSaveAlbum={toggleSaveAlbum}
        savedAlbums={savedAlbums}
        getAlbumSongs={getAlbumSongs}
        setCurrentSong={setCurrentSong}
      />

      {/* --- Artist Dialog Workspace --- */}
      <ArtistDialog
        artistDialogOpen={artistDialogOpen}
        setArtistDialogOpen={setArtistDialogOpen}
        selectedArtist={selectedArtist}
        toggleFollowArtist={toggleFollowArtist}
        followedArtists={followedArtists}
        getArtistSongs={getArtistSongs}
        setCurrentSong={setCurrentSong}
        likedSongs={likedSongs}
        toggleLikeSong={toggleLikeSong}
        downloadedSongs={downloadedSongs}
        downloadSong={downloadSong}
        setSongToAddToPlaylist={setSongToAddToPlaylist}
        setAddToPlaylistOpen={setAddToPlaylistOpen}
      />

      {/* --- Sticky Media Controller Dashboard Frame --- */}
      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          audioRef={audioRef}
          handleTimeUpdate={handleTimeUpdate}
          handleLoadedMetadata={handleLoadedMetadata}
          handleNext={handleNext}
          toggleLikeSong={toggleLikeSong}
          likedSongs={likedSongs}
          handlePrevious={handlePrevious}
          togglePlay={togglePlay}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          handleSeek={handleSeek}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          setFeedbackSong={setFeedbackSong}
          setFeedbackOpen={setFeedbackOpen}
          setCurrentSong={setCurrentSong}
          formatTime={formatTime}
        />
      )}

      {/* --- Action Dialog: Form Modals Forms --- */}
      <CreatePlaylistDialog
        createPlaylistOpen={createPlaylistOpen}
        setCreatePlaylistOpen={setCreatePlaylistOpen}
        handleCreatePlaylist={handleCreatePlaylist}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        inputStyles={inputStyles}
      />

      <AddToPlaylistDialog
        addToPlaylistOpen={addToPlaylistOpen}
        setAddToPlaylistOpen={setAddToPlaylistOpen}
        playlists={playlists}
        handleAddSongToPlaylist={handleAddSongToPlaylist}
      />

      {/* --- ENHANCED REVIEWS & COMMENTS DIALOG --- */}
      <ReviewsDialog
        feedbackOpen={feedbackOpen}
        setFeedbackOpen={setFeedbackOpen}
        setEditingFeedback={setEditingFeedback}
        setFeedbackComment={setFeedbackComment}
        setFeedbackRating={setFeedbackRating}
        feedbackSong={feedbackSong}
        feedbackStats={feedbackStats}
        editingFeedback={editingFeedback}
        handleSubmitFeedback={handleSubmitFeedback}
        feedbackRating={feedbackRating}
        feedbackComment={feedbackComment}
        inputStyles={inputStyles}
        handleCancelEdit={handleCancelEdit}
        getSortedAndFilteredFeedbacks={getSortedAndFilteredFeedbacks}
        feedbackFilter={feedbackFilter}
        setFeedbackFilter={setFeedbackFilter}
        currentUser={currentUser}
        formatRelativeTime={formatRelativeTime}
        handleLikeFeedback={handleLikeFeedback}
        handleOpenFeedbackMenu={handleOpenFeedbackMenu}
      />

      {/* Review Actions Menu */}
      <FeedbackMenu
        feedbackAnchorEl={feedbackAnchorEl}
        handleCloseFeedbackMenu={handleCloseFeedbackMenu}
        selectedFeedbackMenu={selectedFeedbackMenu}
        handleEditFeedback={handleEditFeedback}
        handleDeleteFeedback={handleDeleteFeedback}
      />

      {/* Report Song Dialog */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Report Song: {reportSong?.title}</DialogTitle>
        <Box component="form" onSubmit={handleReportSubmit}>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Please provide a reason why you are flagging this song. A moderator will review it shortly.
            </Typography>
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label="Reason for flagging"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              sx={inputStyles}
              placeholder="e.g. Copyright infringement, offensive content, audio issues..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(162,160,213,0.1)" }}>
            <Button onClick={() => setReportOpen(false)} sx={{ color: "text.secondary", textTransform: "none", fontWeight: "bold" }}>Cancel</Button>
            <Button type="submit" variant="contained" color="error" sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#EF4444" }}>
              Submit Report
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Dynamic Feedback Toast Messages Popup */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: 3, bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444", color: "#100B29", fontWeight: "bold" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}