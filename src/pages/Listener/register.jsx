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

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F97316",
    },
    background: {
      default: "#FFF5F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#94A3B8",
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

  const ListenerRegister = async (e) => {
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

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#FFF5F0",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            border: "1px solid #FFF0E6",
            bgcolor: "#FFFFFF",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            p: 2,
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #FDBA74, #FB7185)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 4px 15px rgba(251,113,133,0.3)",
              }}
            >
              <HeadsetIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", color: "#1E293B", mb: 1, letterSpacing: -0.5 }}
            >
              SoundWave
            </Typography>
            <Typography variant="h6" align="center" sx={{ color: "#94A3B8", mb: 4 }}>
              Listener Signup
            </Typography>

            <Box component="form" onSubmit={ListenerRegister} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: "bold", mt: 1, bgcolor: "#F97316", boxShadow: "0 4px 15px rgba(249,115,22,0.3)", "&:hover": { bgcolor: "#EA580C" } }}
              >
                Create Account
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: "bold", textDecoration: "none", color: "#F97316", "&:hover": { textDecoration: "underline" } }}>
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
          sx={{ width: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}