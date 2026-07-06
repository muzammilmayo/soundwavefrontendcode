import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import authService from "../services/authService";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1db954", // Spotify Green
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

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.login(user);
      showToast("Login Successful", "success");

      const role = res.user.role;
      setTimeout(() => {
        if (role === "Super Admin") {
          navigate("/SuperAdmin/dashboard");
        } else if (role === "Admin") {
          navigate("/Admin/dashboard");
        } else if (role === "Moderator") {
          navigate("/Moderator/dashboard");
        } else if (role === "Artist") {
          navigate("/artist/dashboard");
        } else if (role === "Listener") {
          navigate("/listener/dashboard");
        } else {
          showToast("Unknown user role: " + role, "error");
          authService.logout();
        }
      }, 800);
    } catch (err) {
      showToast(err.response?.data?.message || "Login Failed", "error");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
            maxWidth: 420,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            p: 2,
          }}
        >
          <CardContent>
            <Typography variant="h3" align="center" sx={{ mb: 1 }}>
              🎵
            </Typography>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1, letterSpacing: -1 }}
            >
              SoundWave
            </Typography>
            <Typography variant="h6" align="center" sx={{ color: "text.secondary", mb: 4 }}>
              Welcome Back
            </Typography>

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
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1 }}
              >
                Login
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register" color="primary" sx={{ fontWeight: "bold", textDecoration: "none" }}>
                  Register
                </Link>
              </Typography>
              <Typography variant="body2">
                <Link component={RouterLink} to="/forgot-password" color="primary" sx={{ fontWeight: "bold", textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%", borderRadius: 3 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}