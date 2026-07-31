import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Button, IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { markNotificationsRead, clearNotifications } from "../../features/catalog/catalogSlice";

export default function ListenerNotifications({ userId, activeNotifications, songs, albums, setCurrentSong, setIsPlaying, handleAlbumClick }) {
  const dispatch = useDispatch();
  const [bellAnchorEl, setBellAnchorEl] = useState(null);
  const bellOpen = Boolean(bellAnchorEl);

  const handleOpen = (e) => {
    setBellAnchorEl(e.currentTarget);
    dispatch(markNotificationsRead({ userId }));
  };

  const handleClose = () => {
    setBellAnchorEl(null);
  };

  return (
    <>
      {/* Notifications Bell Icon Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          color: bellOpen ? "#CE04F2" : "#FFFFFF",
          bgcolor: bellOpen ? "rgba(206,4,242,0.1)" : "rgba(255, 255, 255, 0.05)",
          border: "1px solid",
          borderColor: bellOpen ? "rgba(206,4,242,0.3)" : "rgba(162,160,213,0.15)",
          borderRadius: 3,
          p: 1.5,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#01F2EA",
            bgcolor: "rgba(1, 242, 234, 0.05)",
            boxShadow: "0 0 12px rgba(1, 242, 234, 0.2)",
          }
        }}
      >
        <Badge
          badgeContent={activeNotifications.filter(n => !n.read).length}
          color="secondary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.7rem",
              fontWeight: "bold",
              height: 18,
              minWidth: 18,
              bgcolor: "#CE04F2"
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Bell Notification Dropdown Menu */}
      <Menu
        anchorEl={bellAnchorEl}
        open={bellOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1A153A",
              border: "1px solid rgba(162,160,213,0.2)",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              width: 320,
              mt: 1.5,
              "& .MuiMenuItem-root": {
                borderBottom: "1px solid rgba(162,160,213,0.08)",
                whiteSpace: "normal",
                py: 1.5,
                px: 2,
                "&:last-child": { borderBottom: "none" }
              }
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>Notifications</Typography>
          {activeNotifications.length > 0 && (
            <Button
              size="small"
              onClick={() => dispatch(clearNotifications({ userId }))}
              sx={{ textTransform: "none", color: "#01F2EA", fontWeight: "bold", fontSize: "0.75rem", p: 0 }}
            >
              Clear All
            </Button>
          )}
        </Box>
        {activeNotifications.length === 0 ? (
          <MenuItem disabled sx={{ textAlign: "center", justifyContent: "center", color: "text.secondary", py: 4 }}>
            <Typography variant="body2">No notifications yet.</Typography>
          </MenuItem>
        ) : (
          activeNotifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => {
                handleClose();
                if (n.type === "song") {
                  const songObj = songs.find(s => s.song_id === n.targetId);
                  if (songObj) {
                    setCurrentSong(songObj);
                    setIsPlaying(true);
                  }
                } else if (n.type === "album") {
                  const albumObj = albums.find(a => a.album_id === n.targetId);
                  if (albumObj) {
                    handleAlbumClick(albumObj);
                  }
                }
              }}
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.02)" }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: n.type === "song" ? "#01F2EA" : "#CE04F2", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.65rem" }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#FFFFFF", fontWeight: n.read ? "normal" : "bold", lineHeight: 1.4 }}>
                  {n.message}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
