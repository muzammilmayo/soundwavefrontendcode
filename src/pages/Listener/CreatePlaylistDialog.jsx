import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button } from "@mui/material";

export default function CreatePlaylistDialog({
  createPlaylistOpen,
  setCreatePlaylistOpen,
  handleCreatePlaylist,
  newPlaylistName,
  setNewPlaylistName,
  inputStyles
}) {
  return (
    <Dialog 
      open={createPlaylistOpen} 
      onClose={() => setCreatePlaylistOpen(false)} 
      fullWidth 
      maxWidth="xs" 
      slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}
    >
      <DialogTitle sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Create Playlist</DialogTitle>
      <Box component="form" onSubmit={handleCreatePlaylist}>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Playlist Name" 
            value={newPlaylistName} 
            onChange={(e) => setNewPlaylistName(e.target.value)} 
            required 
            variant="outlined" 
            sx={inputStyles} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCreatePlaylistOpen(false)} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#01F2EA", color: "#100B29" }}>Create</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
