import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FlagIcon from "@mui/icons-material/Flag";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function ListenerSidebar({ selectedPlaylist, setSelectedPlaylist, activeTab, setActiveTab, handleLogout, triggerReport }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const itemTypographyProps = (isActive) => ({
    fontSize: '0.85rem',
    fontWeight: isActive ? 'bold' : 500
  });

  return (
    <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)", flexShrink: 0, position: "fixed", top: "64px", left: 0, bottom: 0, height: "calc(100vh - 64px)", zIndex: 1100 }}>
      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(0); }}
            sx={{
              borderRadius: 3,
              py: 0.6,
              px: 2,
              bgcolor: (!selectedPlaylist && activeTab === 0) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: (!selectedPlaylist && activeTab === 0) ? "#01F2EA" : "#A2A0D5" }}><HomeIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(!selectedPlaylist && activeTab === 0)}>Home</Typography>} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(4); }}
            sx={{
              borderRadius: 3,
              py: 0.6,
              px: 2,
              bgcolor: (!selectedPlaylist && activeTab === 4) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: (!selectedPlaylist && activeTab === 4) ? "#01F2EA" : "#A2A0D5" }}><LibraryMusicIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(!selectedPlaylist && activeTab === 4)}>Your Library</Typography>} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => navigate("/profile")} 
            sx={{ 
              borderRadius: 3, 
              py: 0.6, 
              px: 2, 
              color: "#FFFFFF", 
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } 
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}><PersonIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(false)}>Profile</Typography>} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(5); }}
            sx={{
              borderRadius: 3,
              py: 0.6,
              px: 2,
              bgcolor: (!selectedPlaylist && activeTab === 5) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 5) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: (!selectedPlaylist && activeTab === 5) ? "#01F2EA" : "#A2A0D5" }}><SettingsIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(!selectedPlaylist && activeTab === 5)}>Notification Settings</Typography>} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setSelectedPlaylist(null); setActiveTab(7); }}
            sx={{
              borderRadius: 3,
              py: 0.6,
              px: 2,
              bgcolor: (!selectedPlaylist && activeTab === 7) ? "rgba(1, 242, 234, 0.08)" : "transparent",
              color: (!selectedPlaylist && activeTab === 7) ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: (!selectedPlaylist && activeTab === 7) ? "#01F2EA" : "#A2A0D5" }}><FlagIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(!selectedPlaylist && activeTab === 7)}>My Reports</Typography>} />
          </ListItemButton>
        </ListItem>
        
        {user?.is_artist_moderator && (
          <>
            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/artist/dashboard")}
                sx={{
                  borderRadius: 3,
                  py: 0.6,
                  px: 2,
                  bgcolor: "rgba(1, 242, 234, 0.05)",
                  color: "#01F2EA",
                  "&:hover": { bgcolor: "rgba(1, 242, 234, 0.1)" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#01F2EA" }}><PersonIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: "bold" }}>Artist Dashboard</Typography>} />
              </ListItemButton>
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />

        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              borderRadius: 3, 
              py: 0.6, 
              px: 2, 
              color: "#EF4444", 
              "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } 
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: "bold", color: "#EF4444" }}>Logout</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
