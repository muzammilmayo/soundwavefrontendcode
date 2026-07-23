import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Divider } from "@mui/material";
import { Close as CloseIcon, Album as AlbumIcon } from "@mui/icons-material";

export default function AlbumDetailModal({ album, setAlbum, profile, songs, handleSelectSong }) {
  if (!album) return null;
  const albumSongs = (songs || []).filter(s => s.album_id === album.album_id);

  return (
    <Dialog open={!!album} onClose={() => setAlbum(null)} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
        <IconButton onClick={() => setAlbum(null)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{album.title}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>By {profile?.stage_name || "You"} • {albumSongs.length} songs</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "center" }}>
          <Box sx={{ width: 140, height: 140, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.02)" }}>
            {album.cover_image ? <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 60 }} />}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>{album.description || "No description provided."}</Typography>
            <Typography variant="body2" sx={{ color: "#FFFFFF" }}>Released: <strong>{album.release_date ? new Date(album.release_date).toLocaleDateString() : "N/A"}</strong></Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3, borderColor: "rgba(162,160,213,0.15)" }} />
        <Box sx={{ bgcolor: "rgba(255,255,255,0.01)", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(162,160,213,0.1)" }}>
          {albumSongs.map((song, idx) => (
            <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }, cursor: "pointer" }} onClick={() => handleSelectSong(song)}>
              <Typography sx={{ color: "text.secondary", mr: 2 }}>{idx + 1}</Typography>
              <Typography sx={{ color: "#FFFFFF", fontWeight: "600", flexGrow: 1 }}>{song.title}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
