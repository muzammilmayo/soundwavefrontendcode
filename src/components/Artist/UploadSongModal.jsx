import { useState } from "react";
import { useDispatch } from "react-redux";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, 
  Button, TextField, MenuItem, CircularProgress, IconButton 
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { uploadArtistSong, fetchArtistSongs } from "../../features/artist/artistSlice";

export default function UploadSongModal({ open, setOpen, categories, albums, showToast, textFieldStyles }) {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);

  const initialSongForm = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: "",
    description: "",
    category_id: "",
    album_id: "",
    cover_image: null,
    audio: null,
    status: "draft",
    scheduled_for: "",
  };

  const [songForms, setSongForms] = useState([{...initialSongForm}]);

  const handleSongChange = (index, e) => {
    const updated = [...songForms];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setSongForms(updated);
  };

  const handleSongFile = (index, e) => {
    const updated = [...songForms];
    updated[index] = { ...updated[index], audio: e.target.files[0] };
    setSongForms(updated);
  };

  const handleCoverFile = (index, e) => {
    const updated = [...songForms];
    updated[index] = { ...updated[index], cover_image: e.target.files[0] };
    setSongForms(updated);
  };

  const handleAddSongForm = () => {
    setSongForms([...songForms, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      category_id: "",
      album_id: "",
      cover_image: null,
      audio: null,
    }]);
  };

  const handleRemoveSongForm = (index) => {
    const updated = [...songForms];
    updated.splice(index, 1);
    setSongForms(updated);
  };

  const handleUploadSong = async (e) => {
    e.preventDefault();
    if (songForms.some(form => !form.audio)) {
      showToast("An audio file is required for all songs!", "error");
      return;
    }
    if (songForms.some(form => !form.title)) {
      showToast("A title is required for all songs!", "error");
      return;
    }
    
    setActionLoading(true);
    let successCount = 0;

    for (let i = 0; i < songForms.length; i++) {
      const form = songForms[i];
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (form.category_id) formData.append("category_id", form.category_id);
      if (form.album_id) formData.append("album_id", form.album_id);
      if (form.cover_image) formData.append("cover_image", form.cover_image);
      // New lifecycle fields
      if (form.status) formData.append("status", form.status);
      if (form.scheduled_for) formData.append("scheduled_for", form.scheduled_for);
      formData.append("audio", form.audio);

      try {
        const resultAction = await dispatch(uploadArtistSong(formData));
        if (uploadArtistSong.fulfilled.match(resultAction)) {
          successCount++;
        } else {
          showToast(`Failed to upload "${form.title}": ${resultAction.payload || "Unknown error"}`, "error");
        }
      } catch (err) {
        showToast(`Server error during upload of "${form.title}"`, "error");
      }
    }

    setActionLoading(false);
    if (successCount > 0) {
      dispatch(fetchArtistSongs());
    }
    
    if (successCount === songForms.length) {
      showToast(`${successCount} song(s) uploaded successfully!`, "success");
      setOpen(false);
      setSongForms([{...initialSongForm}]);
    } else {
      showToast(`Uploaded ${successCount} out of ${songForms.length} songs.`, "warning");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.2)" } } }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" }}>
        Upload New Song
        <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleUploadSong}>
        <DialogContent sx={{ px: 3, py: 2, overflowY: "auto", maxHeight: "65vh" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {songForms.map((form, index) => (
              <Box key={form.id} sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(162,160,213,0.1)", display: "flex", flexDirection: "column", gap: 3, position: "relative" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#01F2EA" }}>Song #{index + 1}</Typography>
                  {songForms.length > 1 && (
                    <IconButton size="small" onClick={() => handleRemoveSongForm(index)} disabled={actionLoading} sx={{ color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <TextField fullWidth label="Song Title" name="title" value={form.title} onChange={(e) => handleSongChange(index, e)} required disabled={actionLoading} placeholder="Enter song name" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
                <TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={(e) => handleSongChange(index, e)} disabled={actionLoading} placeholder="Tell your fans about this song" slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles} />
                <TextField fullWidth select label="Category" name="category_id" value={form.category_id} onChange={(e) => handleSongChange(index, e)} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles}>
                  <MenuItem value="">-- Select Category --</MenuItem>
                  {(categories || []).map((c) => <MenuItem key={c.category_id} value={c.category_id}>{c.name}</MenuItem>)}
                </TextField>
                <TextField fullWidth select label="Album (Optional)" name="album_id" value={form.album_id} onChange={(e) => handleSongChange(index, e)} disabled={actionLoading} slotProps={{ inputLabel: { shrink: true } }} sx={textFieldStyles}>
                  <MenuItem value="">-- None (Single) --</MenuItem>
                  {(albums || []).map((a) => <MenuItem key={a.album_id} value={a.album_id}>{a.title}</MenuItem>)}
                </TextField>
                <Box>
                  {/* Status selector */}
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={(e) => handleSongChange(index, e)}
                    disabled={actionLoading}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={textFieldStyles}
                  >
                    <MenuItem value="draft">Draft (private)</MenuItem>
                    <MenuItem value="published">Publish Now</MenuItem>
                    <MenuItem value="scheduled">Schedule Release</MenuItem>
                  </TextField>

                  {/* Scheduled datetime, only show when status is scheduled */}
                  {form.status === "scheduled" && (
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Release Date & Time"
                      name="scheduled_for"
                      value={form.scheduled_for}
                      onChange={(e) => handleSongChange(index, e)}
                      disabled={actionLoading}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldStyles}
                    />
                  )}

                  {/* Cover Image File (Optional) */}
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Cover Image File (Optional)</Typography>
                  <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#01F2EA", borderColor: "rgba(1,242,234,0.4)" }}>
                    {form.cover_image ? form.cover_image.name : "Select Cover Image"}
                    <input type="file" accept="image/*" hidden onChange={(e) => handleCoverFile(index, e)} disabled={actionLoading} />
                  </Button>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFFFFF" }}>Audio File (.mp3 or .wav) *</Typography>
                  <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: "dashed", borderRadius: 3, textTransform: "none", color: "#CE04F2", borderColor: "rgba(206,4,242,0.4)" }}>
                    {form.audio ? form.audio.name : "Select Audio File"}
                    <input type="file" accept="audio/mp3,audio/wav,audio/mpeg" hidden onChange={(e) => handleSongFile(index, e)} disabled={actionLoading} />
                  </Button>
                </Box>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSongForm}
              disabled={actionLoading}
              sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", color: "#CE04F2", borderColor: "rgba(206,4,242,0.4)", borderStyle: "dashed", "&:hover": { bgcolor: "rgba(206,4,242,0.05)", borderColor: "#CE04F2" } }}
            >
              Add Another Song
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(162,160,213,0.15)" }}>
          <Button onClick={() => setOpen(false)} disabled={actionLoading} sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={actionLoading} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", boxShadow: "0 4px 14px rgba(1,242,234,0.3)" }}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : `Upload ${songForms.length > 1 ? songForms.length + ' Songs' : 'Song'}`}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
