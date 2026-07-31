import React from "react";
import { Box, Typography, Card, IconButton, Chip, Tooltip, TextField, MenuItem } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FlagIcon from "@mui/icons-material/Flag";
import SongSlider from "./SongSlider";

export default function ListenerHome({
  songs,
  filteredSongs,
  currentSong,
  setCurrentSong,
  artists,
  handleArtistClick,
  likedSongs,
  toggleLikeSong,
  downloadedSongs,
  downloadSong,
  setSongToAddToPlaylist,
  setAddToPlaylistOpen,
  setReportSong,
  setReportOpen,
  sort,
  setSort,
  duration,
  setDuration
}) {
  return (
    <Box>
      {/* --- Horizontal Songs Sliding Cards --- */}
      <SongSlider 
        songs={songs} 
        currentSong={currentSong} 
        setCurrentSong={setCurrentSong} 
        artists={artists} 
        handleArtistClick={handleArtistClick} 
      />

      {/* --- Filtering & Sorting controls --- */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center", bgcolor: "rgba(255,255,255,0.02)", p: 2.5, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold", mr: 1, textTransform: "uppercase", letterSpacing: 1 }}>Filter & Sort:</Typography>
        
        {/* Sort Select */}
        <TextField
          select
          size="small"
          label="Sort By"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              color: "#FFFFFF",
              "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
              "&:hover fieldset": { borderColor: "#01F2EA" },
              "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
            },
            "& .MuiInputLabel-root": { color: "text.secondary", fontSize: "0.85rem" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="">Newest Releases</MenuItem>
          <MenuItem value="popular">Popularity (Plays)</MenuItem>
          <MenuItem value="alphabetical">Alphabetical (A-Z)</MenuItem>
        </TextField>

        {/* Duration Filter */}
        <TextField
          select
          size="small"
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              color: "#FFFFFF",
              "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
              "&:hover fieldset": { borderColor: "#01F2EA" },
              "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
            },
            "& .MuiInputLabel-root": { color: "text.secondary", fontSize: "0.85rem" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="">All Durations</MenuItem>
          <MenuItem value="short">Short (&lt; 3 mins)</MenuItem>
          <MenuItem value="medium">Medium (3 - 5 mins)</MenuItem>
          <MenuItem value="long">Long (&gt; 5 mins)</MenuItem>
        </TextField>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>Dynamic Library</Typography>
      {filteredSongs.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
          <Typography sx={{ color: "text.secondary" }}>No songs found matching filters.</Typography>
        </Card>
      ) : (
        <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
          {filteredSongs.map((song, idx) => (
            <Box 
              key={song.song_id} 
              onClick={() => setCurrentSong(song)} 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                px: 3, 
                py: 2, 
                borderBottom: idx < filteredSongs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", 
                "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, 
                cursor: "pointer" 
              }}
            >
              <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>{idx + 1}</Typography>
              <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, overflow: "hidden" }}>
                {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{song.title}</Typography>
                <Typography
                  variant="body2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const artistObj = artists.find(a => a.artist_profile_id === song.artist_profile_id);
                    if (artistObj) handleArtistClick(artistObj);
                  }}
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-block",
                    "&:hover": { color: "#01F2EA", textDecoration: "underline" }
                  }}
                >
                  {song.ArtistProfile?.stage_name || "Unknown Artist"}
                </Typography>
              </Box>
              {song.Category?.name && <Chip label={song.Category.name} size="small" sx={{ mr: 3, bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />}
              <Typography variant="body2" sx={{ color: "text.secondary", mr: 3, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                {song.play_count || 0} views
              </Typography>
              <Tooltip title={likedSongs.some(s => s.song_id === song.song_id) ? "Unlike Song" : "Like Song"}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleLikeSong(song); }} sx={{ color: likedSongs.some(s => s.song_id === song.song_id) ? "#CE04F2" : "text.secondary", mr: 1 }}>
                  {likedSongs.some(s => s.song_id === song.song_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={downloadedSongs.some(s => s.song_id === song.song_id) ? "Song Downloaded" : "Download Song"}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); downloadSong(song); }} sx={{ color: downloadedSongs.some(s => s.song_id === song.song_id) ? "#01F2EA" : "text.secondary", mr: 1 }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to Playlist">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSongToAddToPlaylist(song); setAddToPlaylistOpen(true); }} sx={{ color: "text.secondary", mr: 1 }}>
                  <PlaylistAddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Report / Flag Track">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setReportSong(song); setReportOpen(true); }} sx={{ color: "text.secondary", mr: 1, "&:hover": { color: "#EF4444" } }}>
                  <FlagIcon />
                </IconButton>
              </Tooltip>
              <IconButton size="small" sx={{ color: "#01F2EA" }}><PlayCircleFilledIcon sx={{ fontSize: 32 }} /></IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
