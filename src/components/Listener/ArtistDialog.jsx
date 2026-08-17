import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton, Chip, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WebIcon from "@mui/icons-material/Web";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

export default function ArtistDialog({
  artistDialogOpen,
  setArtistDialogOpen,
  selectedArtist,
  toggleFollowArtist,
  followedArtists,
  getArtistSongs,
  setCurrentSong,
  likedSongs,
  toggleLikeSong,
  downloadedSongs,
  downloadSong,
  setSongToAddToPlaylist,
  setAddToPlaylistOpen,
  triggerReport
}) {
  return (
    <Dialog 
      open={artistDialogOpen} 
      onClose={() => setArtistDialogOpen(false)} 
      fullWidth 
      maxWidth="md" 
      slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton onClick={() => setArtistDialogOpen(false)} sx={{ color: "text.secondary" }}><ArrowBackIcon /></IconButton>
        <Typography component="span" variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{selectedArtist?.stage_name}</Typography>
        {selectedArtist?.is_verified && (
          <Tooltip title="Verified Artist" placement="right">
            <CheckCircleIcon sx={{ color: "#01F2EA", fontSize: 18 }} />
          </Tooltip>
        )}
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 4 }}>
          <Box sx={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(162,160,213,0.2)" }}>
            {selectedArtist?.profile_image ? (
              <Box component="img" src={selectedArtist.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <PersonIcon sx={{ color: "#01F2EA", fontSize: 44, m: 3 }} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 0.5 }}>{selectedArtist?.stage_name}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>{selectedArtist?.bio || "No biography details."}</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button 
                variant="contained" 
                onClick={() => toggleFollowArtist(selectedArtist)} 
                sx={{ bgcolor: "#CE04F2", color: "#FFF", "&:hover": { bgcolor: "#B003D4" }, textTransform: "none", fontWeight: "bold" }}
              >
                {followedArtists.some(a => a.artist_profile_id === selectedArtist?.artist_profile_id) ? "Following" : "Follow Artist"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => { setArtistDialogOpen(false); triggerReport("artist", selectedArtist.artist_profile_id, selectedArtist.stage_name); }} 
                sx={{ borderColor: "#EF4444", color: "#EF4444", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "rgba(239,68,68,0.05)", borderColor: "#EF4444" } }}
              >
                Report Artist
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Social Media Accounts */}
        {selectedArtist && (selectedArtist.facebook || selectedArtist.instagram || selectedArtist.youtube || selectedArtist.spotify) && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary", mb: 1.5 }}>Connect with Artist</Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {selectedArtist.facebook && (
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedArtist.facebook.startsWith("http") ? selectedArtist.facebook : `https://facebook.com/${selectedArtist.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<FacebookIcon />}
                  sx={{ borderColor: "rgba(162,160,213,0.2)", color: "#FFFFFF", textTransform: "none", borderRadius: 2, "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1,242,234,0.05)" } }}
                >
                  Facebook
                </Button>
              )}
              {selectedArtist.instagram && (
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedArtist.instagram.startsWith("http") ? selectedArtist.instagram : `https://instagram.com/${selectedArtist.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<InstagramIcon />}
                  sx={{ borderColor: "rgba(162,160,213,0.2)", color: "#FFFFFF", textTransform: "none", borderRadius: 2, "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1,242,234,0.05)" } }}
                >
                  Instagram
                </Button>
              )}
              {selectedArtist.youtube && (
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedArtist.youtube.startsWith("http") ? selectedArtist.youtube : `https://youtube.com/${selectedArtist.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<YouTubeIcon />}
                  sx={{ borderColor: "rgba(162,160,213,0.2)", color: "#FFFFFF", textTransform: "none", borderRadius: 2, "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1,242,234,0.05)" } }}
                >
                  YouTube
                </Button>
              )}
              {selectedArtist.spotify && (
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedArtist.spotify.startsWith("http") ? selectedArtist.spotify : `https://open.spotify.com/artist/${selectedArtist.spotify}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WebIcon />}
                  sx={{ borderColor: "rgba(162,160,213,0.2)", color: "#FFFFFF", textTransform: "none", borderRadius: 2, "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1,242,234,0.05)" } }}
                >
                  Spotify
                </Button>
              )}
            </Box>
          </Box>
        )}

        {selectedArtist && (
          <Box>
            {/* Songs Section */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 2, borderBottom: "1px solid rgba(162,160,213,0.15)", pb: 1 }}>Songs</Typography>
            {getArtistSongs(selectedArtist.artist_profile_id).length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>No songs available by this artist.</Typography>
            ) : (
              <Box sx={{ bgcolor: "rgba(255,255,255,0.02)", borderRadius: 3, overflow: "hidden", mb: 4 }}>
                {getArtistSongs(selectedArtist.artist_profile_id).map((song, idx) => (
                  <Box 
                    key={song.song_id} 
                    onClick={() => { setCurrentSong(song); }} 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      px: 3, 
                      py: 1.5, 
                      borderBottom: idx < getArtistSongs(selectedArtist.artist_profile_id).length - 1 ? "1px solid rgba(162,160,213,0.08)" : "none",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }, 
                      cursor: "pointer" 
                    }}
                  >
                    <Typography sx={{ color: "text.secondary", mr: 2, fontSize: "0.85rem", width: 20 }}>{idx + 1}</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: "600", flexGrow: 1, fontSize: "0.9rem" }}>{song.title}</Typography>
                    {song.Category?.name && (
                      <Chip 
                        label={song.Category.name} 
                        size="small" 
                        sx={{ mr: 2, bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary", height: 20, fontSize: "10px" }} 
                      />
                    )}
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
                    <PlayCircleFilledIcon sx={{ color: "#01F2EA", fontSize: 24 }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
