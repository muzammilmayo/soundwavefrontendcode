import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import {
  Home as HomeIcon, CloudUpload as CloudUploadIcon, Album as AlbumIcon,
  Person as PersonIcon, ExitToApp as ExitToAppIcon,
  Drafts as DraftsIcon, People as PeopleIcon, Flag as FlagIcon,
  Shield as ShieldIcon, MusicNote as MusicNoteIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ArtistSidebar({ handleLogout, setUploadOpen, setAlbumOpen, contentTab, setContentTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isPlatformMod = user?.role === "Moderator";
  const isArtistMod = user?.is_artist_moderator;
  const isArtistOwner = user?.role === "Artist";

  const isDashboard = location.pathname === "/artist/dashboard";
  const isPlatformActive = isDashboard && contentTab === 7;
  const isDashboardActive = isDashboard && contentTab !== 5 && contentTab !== 6 && contentTab !== 7;
  const isTeamActive = isDashboard && contentTab === 5;
  const isReportsActive = isDashboard && contentTab === 6;
  const isProfileActive = location.pathname === "/artist/profile";
  const isDraftsActive = location.pathname === "/artist/drafts";

  const handleNav = (tabIndex) => {
    if (setContentTab) {
      setContentTab(tabIndex);
    } else {
      navigate("/artist/dashboard", { state: { tab: tabIndex } });
    }
  };

  const itemTypographyProps = (isActive) => ({
    fontSize: '0.85rem',
    fontWeight: isActive ? 'bold' : 500
  });

  return (
    <Box sx={{ width: 260, bgcolor: "#140E34", p: 3, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(162,160,213,0.15)", position: "fixed", top: "64px", left: 0, bottom: 0, height: "calc(100vh - 64px)", zIndex: 1100 }}>
      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {!isPlatformMod && (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNav(0)} 
                sx={{ 
                  borderRadius: 3, 
                  py: 0.6, 
                  px: 2, 
                  bgcolor: isDashboardActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
                  color: isDashboardActive ? "#01F2EA" : "#FFFFFF",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: isDashboardActive ? "#01F2EA" : "#A2A0D5" }}><HomeIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary={<Typography sx={itemTypographyProps(isDashboardActive)}>Dashboard</Typography>} />
              </ListItemButton>
            </ListItem>
            
            {isArtistOwner && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setUploadOpen(true)} sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                    <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}><CloudUploadIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                    <ListItemText primary={<Typography sx={itemTypographyProps(false)}>Upload Song</Typography>} />
                  </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setAlbumOpen(true)} sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                    <ListItemIcon sx={{ minWidth: 32, color: "#A2A0D5" }}><AlbumIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                    <ListItemText primary={<Typography sx={itemTypographyProps(false)}>Create Album</Typography>} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => navigate("/artist/drafts")} 
                sx={{ 
                  borderRadius: 3, 
                  py: 0.6, 
                  px: 2, 
                  bgcolor: isDraftsActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
                  color: isDraftsActive ? "#01F2EA" : "#FFFFFF",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: isDraftsActive ? "#01F2EA" : "#A2A0D5" }}><DraftsIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary={<Typography sx={itemTypographyProps(isDraftsActive)}>Draft Songs</Typography>} />
              </ListItemButton>
            </ListItem>

            {isArtistOwner && (
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNav(5)} 
                  sx={{ 
                    borderRadius: 3, 
                    py: 0.6, 
                    px: 2, 
                    bgcolor: isTeamActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
                    color: isTeamActive ? "#01F2EA" : "#FFFFFF",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: isTeamActive ? "#01F2EA" : "#A2A0D5" }}><PeopleIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={itemTypographyProps(isTeamActive)}>Team Management</Typography>} />
                </ListItemButton>
              </ListItem>
            )}

            {(isArtistOwner || isArtistMod) && (
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNav(6)} 
                  sx={{ 
                    borderRadius: 3, 
                    py: 0.6, 
                    px: 2, 
                    bgcolor: isReportsActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
                    color: isReportsActive ? "#01F2EA" : "#FFFFFF",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: isReportsActive ? "#01F2EA" : "#A2A0D5" }}><FlagIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={itemTypographyProps(isReportsActive)}>Content Reports</Typography>} />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}

        {isPlatformMod && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNav(7)} 
              sx={{ 
                borderRadius: 3, 
                py: 0.6, 
                px: 2, 
                bgcolor: isPlatformActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
                color: isPlatformActive ? "#01F2EA" : "#FFFFFF",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: isPlatformActive ? "#01F2EA" : "#A2A0D5" }}><ShieldIcon sx={{ fontSize: 18 }} /></ListItemIcon>
              <ListItemText primary={<Typography sx={itemTypographyProps(isPlatformActive)}>Platform Reports</Typography>} />
            </ListItemButton>
          </ListItem>
        )}

        <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />
        
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => navigate("/artist/profile")} 
            sx={{ 
              borderRadius: 3, 
              py: 0.6, 
              px: 2, 
              bgcolor: isProfileActive ? "rgba(1, 242, 234, 0.08)" : "transparent", 
              color: isProfileActive ? "#01F2EA" : "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: isProfileActive ? "#01F2EA" : "#A2A0D5" }}><PersonIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={itemTypographyProps(isProfileActive)}>Profile</Typography>} />
          </ListItemButton>
        </ListItem>

        {user?.role === "Listener" && (
          <>
            <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.15)" }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/listener/dashboard")}
                sx={{
                  borderRadius: 3,
                  py: 0.6,
                  px: 2,
                  bgcolor: "rgba(206, 4, 242, 0.05)",
                  color: "#CE04F2",
                  "&:hover": { bgcolor: "rgba(206, 4, 242, 0.1)" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#CE04F2" }}><HomeIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: "bold" }}>Listener Dashboard</Typography>} />
              </ListItemButton>
            </ListItem>
          </>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 3, py: 0.6, px: 2, color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.05)" } }}>
            <ListItemIcon sx={{ minWidth: 32, color: "#EF4444" }}><ExitToAppIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: "#EF4444" }}>Logout</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
