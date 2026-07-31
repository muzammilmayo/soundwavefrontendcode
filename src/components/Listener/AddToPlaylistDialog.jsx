import React from "react";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

export default function AddToPlaylistDialog({
  addToPlaylistOpen,
  setAddToPlaylistOpen,
  playlists,
  handleAddSongToPlaylist
}) {
  return (
    <Dialog 
      open={addToPlaylistOpen} 
      onClose={() => setAddToPlaylistOpen(false)} 
      fullWidth 
      maxWidth="xs" 
      slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)" } } }}
    >
      <DialogTitle sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Add to Playlist</DialogTitle>
      <DialogContent>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {playlists.map((pl) => (
            <ListItem key={pl.id} disablePadding>
              <ListItemButton 
                onClick={() => handleAddSongToPlaylist(pl.id)} 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "rgba(255,255,255,0.02)", 
                  border: "1px solid rgba(162,160,213,0.1)", 
                  "&:hover": { borderColor: "#01F2EA" } 
                }}
              >
                <QueueMusicIcon sx={{ color: "#01F2EA", mr: 2 }} />
                <ListItemText primary={pl.name} secondary={`${pl.songs.length} tracks`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
