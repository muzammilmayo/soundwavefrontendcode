import { Link, useNavigate } from "react-router-dom";
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

  const logout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#1E293B",
        borderBottom: "1px solid #FFF0E6",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #FDBA74, #FB7185)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(251,113,133,0.3)",
            }}
          >
            <MusicNoteIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#1E293B",
              letterSpacing: "-0.5px",
            }}
          >
            SoundWave
          </Typography>
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {useSelector(state => !!state.auth?.user) ? (
            <Button
              variant="outlined"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "#FECACA",
                color: "#DC2626",
                px: 3,
                py: 1,
                "&:hover": {
                  borderColor: "#DC2626",
                  bgcolor: "#FEF2F2",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#64748B",
                  borderColor: "#E2E8F0",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: "#F97316",
                    color: "#F97316",
                    bgcolor: "#FFF5F0",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#F97316",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                  "&:hover": {
                    backgroundColor: "#EA580C",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
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