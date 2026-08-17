import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ListenerNotifications from "./ListenerNotifications";

export default function ListenerHeader({
  userId,
  activeNotifications,
  songs,
  albums,
  setCurrentSong,
  setIsPlaying,
  handleAlbumClick,
  search,
  setSearch
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Welcome Back 👋</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Discover and listen to published artist music.</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Notifications Bell Icon Button */}
        <ListenerNotifications 
          userId={userId}
          activeNotifications={activeNotifications}
          songs={songs}
          albums={albums}
          setCurrentSong={setCurrentSong}
          setIsPlaying={setIsPlaying}
          handleAlbumClick={handleAlbumClick}
        />

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
    </Box>
  );
}
