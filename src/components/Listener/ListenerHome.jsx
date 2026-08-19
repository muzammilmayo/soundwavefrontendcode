import React, { useState } from "react";
import { Box, Typography, Card, IconButton, Chip, Tooltip, TextField, MenuItem, Button, Collapse, Paper } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FlagIcon from "@mui/icons-material/Flag";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  triggerReport,
  sort,
  setSort,
  duration,
  setDuration,
  page,
  setPage,
  pagination,
  categories = [],
  albums = [],
  artistFilter,
  setArtistFilter,
  albumFilter,
  setAlbumFilter,
  yearFilter,
  setYearFilter,
  filterOpen,
  setFilterOpen,
  categoryFilter,
  setCategoryFilter
}) {

  // Pagination details
  const { totalPages = 1, hasNext = false, hasPrevious = false, totalRecords = 0 } = pagination || {};

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

      {/* --- Collapsible Filtering & Sorting Controls --- */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(255,255,255,0.02)", p: 2, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", mb: filterOpen ? 2 : 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterListIcon sx={{ color: "#01F2EA" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Catalog Controls
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setFilterOpen(!filterOpen)}
            sx={{ textTransform: "none", borderRadius: 2, borderColor: "#01F2EA", color: "#01F2EA", "&:hover": { borderColor: "#CE04F2", color: "#CE04F2" } }}
          >
            {filterOpen ? "Hide Advanced Controls" : "Show Filters & Sorting"}
          </Button>
        </Box>

        <Collapse in={filterOpen}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "#1A153A", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2.5 }}>
            
            {/* Sorting Dropdown */}
            <TextField
              select
              size="small"
              label="Sort Order"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{
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
              <MenuItem value="oldest">Oldest Releases</MenuItem>
              <MenuItem value="popular">Popularity (Plays)</MenuItem>
              <MenuItem value="most_liked">Most Liked Tracks</MenuItem>
              <MenuItem value="alphabetical">Title (A - Z)</MenuItem>
              <MenuItem value="z-a">Title (Z - A)</MenuItem>
            </TextField>

            {/* Duration Selector */}
            <TextField
              select
              size="small"
              label="Track Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              sx={{
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

            {/* Category / Genre Filter */}
            <TextField
              select
              size="small"
              label="Music Genre"
              value={categoryFilter || ""}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              sx={{
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
              <MenuItem value="">All Genres</MenuItem>
              {categories.map(c => (
                <MenuItem key={c.category_id} value={c.category_id}>{c.name}</MenuItem>
              ))}
            </TextField>

            {/* Artist Filter */}
            <TextField
              select
              size="small"
              label="Filter by Artist"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              sx={{
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
              <MenuItem value="">All Artists</MenuItem>
              {artists.map(a => (
                <MenuItem key={a.artist_profile_id} value={a.artist_profile_id}>{a.stage_name}</MenuItem>
              ))}
            </TextField>

            {/* Album Filter */}
            <TextField
              select
              size="small"
              label="Filter by Album"
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
              sx={{
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
              <MenuItem value="">All Albums</MenuItem>
              {albums.map(al => (
                <MenuItem key={al.album_id} value={al.album_id}>{al.title}</MenuItem>
              ))}
            </TextField>

            {/* Release Year Input */}
            <TextField
              size="small"
              label="Release Year"
              placeholder="e.g. 2026"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              sx={{
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
            />
          </Paper>
        </Collapse>
      </Box>

      {/* --- Song Grid Display --- */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>
        Dynamic Library ({totalRecords} tracks)
      </Typography>
      
      {filteredSongs.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
          <Typography sx={{ color: "text.secondary" }}>No songs found matching filters.</Typography>
        </Card>
      ) : (
        <Box>
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
                <Typography sx={{ color: "text.secondary", width: 30, fontSize: "0.85rem" }}>
                  {idx + 1 + (page - 1) * 10}
                </Typography>
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
                <Tooltip title={likedSongs.some(s => (s.song_id || s.id) === (song.song_id || song.id)) ? "Unlike Song" : "Like Song"}>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleLikeSong(song); }} sx={{ color: likedSongs.some(s => (s.song_id || s.id) === (song.song_id || song.id)) ? "#CE04F2" : "text.secondary", mr: 1 }}>
                    {likedSongs.some(s => (s.song_id || s.id) === (song.song_id || song.id)) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={downloadedSongs.some(s => (s.song_id || s.id) === (song.song_id || song.id)) ? "Song Downloaded" : "Download Song"}>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); downloadSong(song); }} sx={{ color: downloadedSongs.some(s => (s.song_id || s.id) === (song.song_id || song.id)) ? "#01F2EA" : "text.secondary", mr: 1 }}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to Playlist">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSongToAddToPlaylist(song); setAddToPlaylistOpen(true); }} sx={{ color: "text.secondary", mr: 1 }}>
                    <PlaylistAddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Report / Flag Track">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); triggerReport("song", song.song_id, song.title); }} sx={{ color: "text.secondary", mr: 1, "&:hover": { color: "#EF4444" } }}>
                    <FlagIcon />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" sx={{ color: "#01F2EA" }}><PlayCircleFilledIcon sx={{ fontSize: 32 }} /></IconButton>
              </Box>
            ))}
          </Box>

          {/* --- Pagination Footer Controls --- */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3, gap: 2 }}>
              <IconButton 
                disabled={!hasPrevious} 
                onClick={() => setPage(page - 1)}
                sx={{ color: hasPrevious ? "#01F2EA" : "rgba(255,255,255,0.05)" }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                Page {page} of {totalPages}
              </Typography>
              <IconButton 
                disabled={!hasNext} 
                onClick={() => setPage(page + 1)}
                sx={{ color: hasNext ? "#01F2EA" : "rgba(255,255,255,0.05)" }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
