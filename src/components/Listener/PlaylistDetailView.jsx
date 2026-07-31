import React from "react";
import { Box, Typography, Button, Card, IconButton } from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import ClearIcon from "@mui/icons-material/Clear";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

export default function PlaylistDetailView({
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  savePlaylists,
  setActiveTab,
  artists,
  handleArtistClick,
  setCurrentSong
}) {
  return (
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
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          onClick={() => { 
            if (window.confirm("Delete playlist?")) { 
              const updated = playlists.filter(p => p.id !== selectedPlaylist.id); 
              savePlaylists(updated); 
              setSelectedPlaylist(null); 
              setActiveTab(0); 
            } 
          }} 
          sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
        >
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
                <Typography
                  variant="body2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const artistObj = artists.find(a => a.artist_profile_id === song.artist_profile_id);
                    if (artistObj) {
                      setSelectedPlaylist(null); // Close playlist detailed view
                      handleArtistClick(artistObj); // Open artist dialog modal
                    }
                  }}
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "inline-block",
                    "&:hover": { color: "#01F2EA", textDecoration: "underline" }
                  }}
                >
                  {song.ArtistProfile?.stage_name || "Unknown Artist"}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const updated = playlists.map(p => p.id === selectedPlaylist.id ? { ...p, songs: p.songs.filter(s => s.song_id !== song.song_id) } : p); 
                  savePlaylists(updated); 
                  setSelectedPlaylist(updated.find(p => p.id === selectedPlaylist.id)); 
                }} 
                sx={{ color: "text.secondary", mr: 2, "&:hover": { color: "#EF4444" } }}
              >
                <ClearIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: "#01F2EA" }}><PlayCircleFilledIcon sx={{ fontSize: 28 }} /></IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
