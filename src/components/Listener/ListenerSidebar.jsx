import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function ListenerSidebar({ selectedPlaylist, setSelectedPlaylist, activeTab, setActiveTab, handleLogout }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)", flexShrink: 0 }}>
      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(0); }}
            sx={{
              borderRadius: 2,
              bgcolor: (!selectedPlaylist && activeTab === 0) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#A2A0D5" }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" sx={{ "& .MuiListItemText-primary": { fontWeight: "bold" } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(4); }}
            sx={{
              borderRadius: 2,
              bgcolor: (!selectedPlaylist && activeTab === 4) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#A2A0D5" }}><LibraryMusicIcon /></ListItemIcon>
            <ListItemText primary="Your Library" sx={{ "& .MuiListItemText-primary": { fontWeight: "bold" } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
            <ListItemIcon sx={{ color: "#A2A0D5" }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(5); }}
            sx={{
              borderRadius: 2,
              bgcolor: (!selectedPlaylist && activeTab === 5) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 5) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ color: (!selectedPlaylist && activeTab === 5) ? "#01F2EA" : "#A2A0D5" }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Notification Settings" sx={{ "& .MuiListItemText-primary": { fontWeight: "bold" } }} />
          </ListItemButton>
        </ListItem>
        
        <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
            <ListItemIcon sx={{ color: "#EF4444" }}><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "#EF4444", fontWeight: "bold" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
