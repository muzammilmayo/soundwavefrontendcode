import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, TextField, CircularProgress, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createPublicAlbum } from "../../../features/catalog/catalogSlice";
import { fetchArtistAlbums } from "../../../features/artist/artistSlice";

export default function CreateAlbumModal({ open, setOpen, showToast, textFieldStyles }) {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    release_date: "",
  });

  const handleAlbumChange = (e) => {
    setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description);
    formData.append("release_date", albumForm.release_date || "");
    formData.append("is_published", "true");
    if (albumForm.cover_image) {
      formData.append("cover_image", albumForm.cover_image);
    }

    try {
      const resultAction = await dispatch(createPublicAlbum(formData));
      if (createPublicAlbum.fulfilled.match(resultAction)) {
        showToast("Album created successfully!", "success");
        setOpen(false);
        setAlbumForm({
          title: "",
          description: "",
          cover_image: null,
          release_date: "",
        });
        dispatch(fetchArtistAlbums());
      } else {
        showToast(resultAction.payload || "Failed to create album", "error");
      }
    } catch (err) {
      showToast("Server error during album creation", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
        Create New Album
        <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleCreateAlbum}>
        <DialogContent sx={{ px: 3, py: 1, overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth label="Album Title" name="title" value={albumForm.title} onChange={handleAlbumChange} required disabled={actionLoading} placeholder="Enter album name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <TextField fullWidth multiline rows={2} label="Description" name="description" value={albumForm.description} onChange={handleAlbumChange} disabled={actionLoading} placeholder="Tell your listeners about this album" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <TextField fullWidth type="date" label="Release Date" name="release_date" value={albumForm.release_date} onChange={handleAlbumChange} required disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Cover Image File (Optional)</Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#01F2EA", borderColor: "rgba(1,242,234,0.4)" }}>
                {albumForm.cover_image ? albumForm.cover_image.name : "Select Cover Image"}
                <input type="file" accept="image/*" hidden onChange={(e) => setAlbumForm({ ...albumForm, cover_image: e.target.files[0] })} disabled={actionLoading} />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(162,160,213,0.15)" }}>
          <Button onClick={() => setOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29" }}>Create Album</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
