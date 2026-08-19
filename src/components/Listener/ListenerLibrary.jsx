import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid, IconButton, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import HistoryIcon from "@mui/icons-material/History";

function formatTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function ListenerLibrary({
  likedSongs,
  savedAlbums,
  followedArtists,
  downloadedSongs,
  recentlyPlayed,
  toggleLikeSong,
  toggleSaveAlbum,
  toggleFollowArtist,
  removeDownloadedSong,
  handleAlbumClick,
  handleArtistClick,
  setCurrentSong,
  artists
}) {
  const [libraryTab, setLibraryTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Your Library</Typography>
      <Tabs 
        value={libraryTab} 
        onChange={(e, val) => setLibraryTab(val)} 
        textColor="primary" 
        indicatorColor="primary" 
        sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" } }}
      >
        <Tab label="Liked Songs" icon={<FavoriteIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
        <Tab label="Saved Albums" icon={<AlbumIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
        <Tab label="Followed Artists" icon={<PersonIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
        <Tab label="Downloads" icon={<DownloadIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
        <Tab label="Recently Played" icon={<HistoryIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold" }} />
      </Tabs>

      {libraryTab === 0 && (
        <Box>
          {likedSongs.length === 0 ? (
            <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No liked songs yet.</Typography></Card>
          ) : (
            <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
              {likedSongs.map((song, idx) => (
                <Box key={song.song_id || song.id || idx} onClick={() => setCurrentSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: idx < likedSongs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, cursor: "pointer" }}>
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
              {savedAlbums.map((album, idx) => (
                <Grid item xs={3} sm={3} md={3} lg={3} key={album.album_id || album.id || idx}>
                  <Card onClick={() => handleAlbumClick(album)} sx={{ height: "100%", maxWidth: 120, display: "flex", flexDirection: "column", borderRadius: 2, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-4px)", borderColor: "#01F2EA", boxShadow: "0 0 15px rgba(1,242,234,0.2)" } }}>
                    <Box sx={{ aspectRatio: "1/1", width: "100%", bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {album.cover_image ? <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 32 }} />}
                    </Box>
                    <CardContent sx={{ p: 0.8, "&:last-child": { pb: 0.8 } }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFFFFF", fontSize: "0.78rem" }}>{album.title}</Typography>
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

      {libraryTab === 2 && (
        <Grid container spacing={3}>
          {followedArtists.map((art, idx) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={art.artist_profile_id || art.id || idx}>
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
          {downloadedSongs.length === 0 ? (
            <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}><Typography sx={{ color: "text.secondary" }}>No downloads yet.</Typography></Card>
          ) : (
            downloadedSongs.map((song) => (
              <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, bgcolor: "background.paper", borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                <Box sx={{ flexGrow: 1 }}><Typography sx={{ color: "#FFFFFF", fontWeight: "600" }}>{song.title}</Typography></Box>
                <Button size="small" color="error" onClick={() => removeDownloadedSong(song.song_id)}>Remove</Button>
              </Box>
            ))
          )}
        </Box>
      )}

      {libraryTab === 4 && (
        <Box>
          {!recentlyPlayed || recentlyPlayed.length === 0 ? (
            <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
              <Typography sx={{ color: "text.secondary" }}>No listening history recorded yet.</Typography>
            </Card>
          ) : (
            <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
              {recentlyPlayed.map((item, idx) => {
                const song = item.Song;
                if (!song) return null;
                return (
                  <Box 
                    key={item.history_id} 
                    onClick={() => setCurrentSong(song)} 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      px: 3, 
                      py: 2, 
                      borderBottom: idx < recentlyPlayed.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", 
                      "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, 
                      cursor: "pointer" 
                    }}
                  >
                    <Typography sx={{ color: "text.secondary", width: 30 }}>{idx + 1}</Typography>
                    <Box sx={{ width: 40, height: 40, mr: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, overflow: "hidden" }}>
                      {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: "600", color: "#FFFFFF" }}>{song.title}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {song.ArtistProfile?.stage_name || "Unknown Artist"}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", ml: 2 }}>
                      {formatTimeAgo(item.played_at)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
