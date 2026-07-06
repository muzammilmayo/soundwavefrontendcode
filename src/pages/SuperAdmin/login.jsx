import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  createTheme,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SuperAdminIcon,
  Headset as ListenerIcon,
  Brush as ArtistIcon,
  Security as ModeratorIcon,
} from "@mui/icons-material";
import authService from "../../services/authService";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1db954",
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

const ROLES = [
  { id: "Super Admin", label: "Super Admin", icon: <SuperAdminIcon />, path: "/SuperAdmin/dashboard" },
  { id: "Admin", label: "Admin", icon: <AdminIcon />, path: "/Admin/dashboard" },
  { id: "Moderator", label: "Moderator", icon: <ModeratorIcon />, path: "/Moderator/dashboard" },
  { id: "Artist", label: "Artist", icon: <ArtistIcon />, path: "/artist/dashboard" },
  { id: "Listener", label: "Listener", icon: <ListenerIcon />, path: "/listener/dashboard" },
];

export default function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Listener");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setSelectedRole(newRole);
      setError("");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(user);

      // Check if user has the selected role
      if (res.user.role !== selectedRole) {
        setError(`Access Denied: You are registered as "${res.user.role}", not "${selectedRole}".`);
        await authService.logout();
        setLoading(false);
        return;
      }

      // Redirect based on role
      const roleConfig = ROLES.find((r) => r.id === selectedRole);
      navigate(roleConfig?.path || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                🎵
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                SoundWave
              </Typography>
            </Box>

            <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
              Welcome Back
            </Typography>

            <Typography variant="body2" align="center" sx={{ color: "text.secondary", mb: 3 }}>
              Select your role and sign in
            </Typography>

            {/* Role Selector */}
            <ToggleButtonGroup
              value={selectedRole}
              exclusive
              onChange={handleRoleChange}
              fullWidth
              sx={{
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px !important",
                  flex: "1 1 auto",
                  minWidth: 80,
                  py: 1,
                },
              }}
            >
              {ROLES.map((role) => (
                <ToggleButton
                  key={role.id}
                  value={role.id}
                  sx={{
                    color: "text.secondary",
                    "&.Mui-selected": {
                      bgcolor: "rgba(29, 185, 84, 0.15)",
                      color: "primary.main",
                      borderColor: "primary.main",
                    },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    {role.icon}
                    <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                      {role.label}
                    </Typography>
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={login} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                placeholder="Enter your email"
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={<LockIcon />}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mt: 1,
                }}
              >
                {loading ? "Signing in..." : `Login as ${selectedRole}`}
              </Button>
            </Box>

            {/* Register Link */}
            <Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#1db954",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Register
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}