import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

export default function AlbumDialog({
  albumDialogOpen,
  setAlbumDialogOpen,
  selectedAlbum,
  artists,
  handleArtistClick,
  toggleSaveAlbum,
  savedAlbums,
  getAlbumSongs,
  setCurrentSong,
  triggerReport
}) {
  return (
    <Dialog 
      open={albumDialogOpen} 
      onClose={() => setAlbumDialogOpen(false)} 
      fullWidth 
      maxWidth="md" 
      slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton onClick={() => setAlbumDialogOpen(false)} sx={{ color: "text.secondary" }}><ArrowBackIcon /></IconButton>
        <Typography component="span" variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{selectedAlbum?.title}</Typography>
        {selectedAlbum?.ArtistProfile?.stage_name && (
          <Typography
            variant="subtitle2"
            onClick={(e) => {
              e.stopPropagation();
              const artistObj = artists.find(a => a.artist_profile_id === selectedAlbum.artist_profile_id);
              if (artistObj) {
                setAlbumDialogOpen(false); // Close album dialog
                handleArtistClick(artistObj); // Open artist dialog
              }
            }}
            sx={{
              color: "#01F2EA",
              cursor: "pointer",
              ml: 2,
              "&:hover": { textDecoration: "underline" }
            }}
          >
            By {selectedAlbum.ArtistProfile.stage_name}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          <Box sx={{ width: 140, height: 140, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.2)" }}>
            <Box component="img" src={selectedAlbum?.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>{selectedAlbum?.description || "No description available."}</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button variant="outlined" startIcon={<BookmarkIcon />} onClick={() => toggleSaveAlbum(selectedAlbum)} sx={{ borderColor: "#01F2EA", color: "#01F2EA", textTransform: "none", fontWeight: "bold" }}>
                {savedAlbums.some(a => a.album_id === selectedAlbum?.album_id) ? "Saved" : "Save Album"}
              </Button>
              <Button variant="outlined" onClick={() => { setAlbumDialogOpen(false); triggerReport("album", selectedAlbum.album_id, selectedAlbum.title); }} sx={{ borderColor: "#EF4444", color: "#EF4444", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "rgba(239,68,68,0.05)", borderColor: "#EF4444" } }}>
                Report Album
              </Button>
            </Box>
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
  );
}
