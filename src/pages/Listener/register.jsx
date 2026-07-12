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
import HeadsetIcon from "@mui/icons-material/Headset";
import authService from "../../services/authService";

// ===== HARDCODED NEON DARK THEME =====
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#01F2EA", // Neon Cyan
    },
    background: {
      default: "#100B29", // Deep Purple Theme BG
      paper: "#1A153A", // Purple Card BG
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A2A0D5", // Soft Lavender
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

export default function ListenerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role_id: 5,
  });

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleListenerRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.register(form);
      showToast(res.message || "Registration successful!", "success");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      showToast(err.response?.data?.message || "Registration Failed", "error");
    }
  };

  // Reusable styling parameters for form fields
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "rgba(255, 255, 255, 0.02)",
      "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
      "&:hover fieldset": { borderColor: "#01F2EA" },
      "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
    },
    "& .MuiInputLabel-root": {
      color: "text.secondary",
      "&.Mui-focused": { color: "#01F2EA" },
    },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
      py: 1.6,
    },
  };

  return (
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
            borderRadius: 4,
            border: "1px solid rgba(162, 160, 213, 0.2)",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            p: 2,
          }}
        >
          <CardContent>
            {/* Glowing Headset Badge */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(1, 242, 234, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 0 15px rgba(1, 242, 234, 0.2)",
              }}
            >
              <HeadsetIcon sx={{ color: "#01F2EA", fontSize: 28, filter: "drop-shadow(0 0 6px #01F2EA)" }} />
            </Box>

            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 0.5, letterSpacing: -0.5 }}
            >
              SoundWave
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: "text.secondary", mb: 4 }}>
              Listener Signup
            </Typography>

            <Box component="form" onSubmit={handleListenerRegister} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={textFieldStyles}
              />

              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={textFieldStyles}
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={textFieldStyles}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  mt: 1,
                  bgcolor: "#01F2EA",
                  color: "#100B29",
                  boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                  transition: "all 0.2s ease-out",
                  "&:hover": {
                    bgcolor: "#00DDD5",
                    boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Create Account
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: "#CE04F2", // Neon Magenta Accent
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login
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
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            bgcolor: toast.severity === "success" ? "#10B981" : "#EF4444",
            color: "#100B29",
            fontWeight: "bold",
            "& .MuiAlert-icon": { color: "#100B29" },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}