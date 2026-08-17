import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";
import authService from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Checking auth status safely from Redux state
  const user = useSelector(state => state.auth?.user);
  const isAuthenticated = !!user;

  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  let dashboardPath = "/";
  if (isAuthenticated && user.role) {
    const role = user.role;
    if (role === "Listener") {
      dashboardPath = "/listener/dashboard";
    } else if (role === "Artist") {
      dashboardPath = "/artist/dashboard";
    } else if (role === "Admin") {
      dashboardPath = "/Admin/dashboard";
    } else if (role === "Super Admin") {
      dashboardPath = "/SuperAdmin/dashboard";
    } else if (role === "Moderator") {
      dashboardPath = "/artist/dashboard";
    }
  }

  const logout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#1A153A", // Purple Card Background from Dashboard
        color: "#FFFFFF",
        borderBottom: "1px solid rgba(162, 160, 213, 0.15)", // Subtle container border
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        {/* --- Logo & Brand --- */}
        <Box
          component={Link}
          to={isLoginPage ? location.pathname : dashboardPath}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {/* Glowing Neon Icon container */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(1, 242, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(1, 242, 234, 0.2)",
            }}
          >
            <MusicNoteIcon 
              sx={{ 
                color: "#01F2EA", // Neon Cyan 
                fontSize: 22,
                filter: "drop-shadow(0 0 4px #01F2EA)" 
              }} 
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            SoundWave
          </Typography>
        </Box>

        {/* --- Dynamic Auth Action Buttons --- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!isAuthenticated && (
            <>
              {/* Login Button (Neon Borderless/Subtle look) */}
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#A2A0D5", // Soft Lavender Text
                  borderColor: "rgba(162, 160, 213, 0.3)",
                  px: 3,
                  py: 0.8,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#01F2EA", // Hovering Neon Cyan
                    color: "#01F2EA",
                    bgcolor: "rgba(1, 242, 234, 0.05)",
                    boxShadow: "0 0 12px rgba(1, 242, 234, 0.2)",
                  },
                }}
              >
                Login
              </Button>

              {/* Register Button (Solid Filled Neon Cyan) */}
              <Button
                component={Link}
                to="/register"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#01F2EA", // Vibrant Neon Cyan Action
                  color: "#100B29", // Dark contrast text color
                  px: 3,
                  py: 0.8,
                  boxShadow: "0 4px 14px rgba(1, 242, 234, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#00DDD5",
                    boxShadow: "0 6px 20px rgba(1, 242, 234, 0.6)",
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}