import React from "react";
import { Box, Typography, IconButton, Slider } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";

export default function MusicPlayer({
  currentSong,
  audioRef,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleNext,
  toggleLikeSong,
  likedSongs,
  handlePrevious,
  togglePlay,
  isPlaying,
  currentTime,
  duration,
  handleSeek,
  volume,
  handleVolumeChange,
  setFeedbackSong,
  setFeedbackOpen,
  setCurrentSong,
  formatTime
}) {
  return (
    <Box sx={{ position: "fixed", bottom: 0, left: "260px", right: 0, height: 95, bgcolor: "#140E34", borderTop: "2px solid rgba(1, 242, 234, 0.3)", display: "flex", alignItems: "center", px: 4, justifyContent: "space-between", zIndex: 1100, boxShadow: "0 -4px 20px rgba(1,242,234,0.15)" }}>
      <audio 
        ref={audioRef} 
        src={`http://localhost:5000/uploads/${currentSong.audio_file}`} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata} 
        onEnded={handleNext} 
      />
      
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
  );
}
