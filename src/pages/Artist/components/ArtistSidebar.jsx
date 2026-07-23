import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import {
  Home as HomeIcon, CloudUpload as CloudUploadIcon, Album as AlbumIcon,
  Person as PersonIcon, ExitToApp as ExitToAppIcon,
  Drafts as DraftsIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ArtistSidebar({ handleLogout, setUploadOpen, setAlbumOpen }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)" }}>
      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/artist/dashboard")} sx={{ borderRadius: 3, py: 1.2, px: 2, bgcolor: "rgba(1, 242, 234, 0.08)", color: "#01F2EA" }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#01F2EA" }}><HomeIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ "& .MuiListItemText-primary": { fontWeight: "bold" } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setUploadOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><CloudUploadIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Upload Song" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAlbumOpen(true)} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><AlbumIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Create Album" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/artist/drafts")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><DraftsIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Draft Songs" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 2, borderColor: "rgba(162,160,213,0.15)" }} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/artist/profile")} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#A2A0D5" }}><PersonIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Profile" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ "& .MuiListItemText-primary": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
