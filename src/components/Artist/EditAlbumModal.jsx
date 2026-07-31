import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, TextField, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import api from "../../api";
import { fetchArtistAlbums } from "../../features/artist/artistSlice";

export default function EditAlbumModal({ open, setOpen, album, showToast, textFieldStyles }) {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const [editAlbumForm, setEditAlbumForm] = useState({
    album_id: "",
    title: "",
    description: "",
    cover_image: "",
    release_date: "",
  });

  useEffect(() => {
    if (album) {
      setEditAlbumForm({
        album_id: album.album_id,
        title: album.title || "",
        description: album.description || "",
        cover_image: album.cover_image || "",
        release_date: album.release_date ? album.release_date.split("T")[0] : "",
      });
    }
  }, [album]);

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/catalog/albums/${editAlbumForm.album_id}`, {
        title: editAlbumForm.title,
        description: editAlbumForm.description,
        cover_image: editAlbumForm.cover_image,
        release_date: editAlbumForm.release_date || null,
      });
      showToast("Album updated successfully!", "success");
      setOpen(false);
      dispatch(fetchArtistAlbums());
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update album", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
        Modify Album ✏️
        <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleUpdateAlbum}>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField fullWidth label="Album Title" value={editAlbumForm.title} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, title: e.target.value })} required disabled={actionLoading} placeholder="Enter album name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <TextField fullWidth multiline rows={2} label="Album Description" value={editAlbumForm.description} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, description: e.target.value })} disabled={actionLoading} placeholder="Enter description" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <TextField fullWidth label="Cover Image URL" value={editAlbumForm.cover_image} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, cover_image: e.target.value })} disabled={actionLoading} placeholder="URL path" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <TextField fullWidth type="date" label="Release Date" value={editAlbumForm.release_date} onChange={(e) => setEditAlbumForm({ ...editAlbumForm, release_date: e.target.value })} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29" }}>Save Changes</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
