import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  Slide,
} from "@mui/material";
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  LockReset as LockResetIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import authService from "../services/authService";

// ===== LIGHT THEME =====
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F97316" },
    background: { default: "#FFF5F0", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#94A3B8" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

// ===== DARK THEME =====
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F97316" },
    background: { default: "#0F172A", paper: "#1E293B" },
    text: { primary: "#F1F5F9", secondary: "#94A3B8" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("forgotPasswordDarkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("forgotPasswordDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const theme = darkMode ? darkTheme : lightTheme;

  // Dynamic colors
  const bg = darkMode ? "#0F172A" : "#FFF5F0";
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const cardBorder = darkMode ? "#334155" : "#FFF0E6";
  const textPrimary = darkMode ? "#F1F5F9" : "#1E293B";
  const textSecondary = darkMode ? "#94A3B8" : "#94A3B8";
  const inputBg = darkMode ? "#0F172A" : "#FFFFFF";
  const inputBorder = darkMode ? "#334155" : "#E2E8F0";
  const inputBorderFocus = darkMode ? "#F97316" : "#F97316";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authService.forgotPassword(email);
      setSuccess(res.message || "Password reset link sent to your email!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: bg,
          p: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Dark Mode Toggle */}
        <IconButton
          onClick={toggleDarkMode}
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            color: darkMode ? "#F59E0B" : "#F97316",
            bgcolor: darkMode ? "rgba(245,158,11,0.1)" : "rgba(249,115,22,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: darkMode ? "rgba(245,158,11,0.2)" : "rgba(249,115,22,0.2)",
              transform: "rotate(15deg) scale(1.1)",
            },
          }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/login")}
          startIcon={<ArrowBackIcon />}
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            color: textSecondary,
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 3,
            px: 2,
            py: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#F97316",
              bgcolor: darkMode ? "rgba(249,115,22,0.1)" : "#FFF5F0",
            },
          }}
        >
          Back to Login
        </Button>

        {/* Main Card */}
        <Slide direction="up" in={true} timeout={600}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 4,
              border: `1px solid ${cardBorder}`,
              bgcolor: cardBg,
              boxShadow: darkMode
                ? "0 25px 50px rgba(0,0,0,0.3)"
                : "0 25px 50px rgba(0,0,0,0.08)",
              position: "relative",
              zIndex: 1,
              overflow: "visible",
            }}
          >
            {/* Top accent line */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                bgcolor: "#F97316",
                borderRadius: "4px 4px 0 0",
              }}
            />

            <CardContent sx={{ p: 5 }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: darkMode ? "rgba(249,115,22,0.15)" : "#FFF5F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1) rotate(-5deg)",
                    boxShadow: "0 8px 25px rgba(249,115,22,0.2)",
                  },
                }}
              >
                <LockResetIcon sx={{ fontSize: 32, color: "#F97316" }} />
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: textPrimary,
                  mb: 1,
                }}
              >
                Forgot Password?
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: textSecondary,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                No worries! Enter your registered email address and we&apos;ll send you a password reset link.
              </Typography>

              {/* Error Alert */}
              <Fade in={Boolean(error)}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: darkMode ? "#450A0A" : "#FEF2F2",
                    color: "#DC2626",
                    border: "1px solid #FECACA",
                    "& .MuiAlert-icon": { color: "#DC2626" },
                  }}
                >
                  {error}
                </Alert>
              </Fade>

              {/* Success Alert */}
              <Fade in={Boolean(success)}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: darkMode ? "#064E3B" : "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    "& .MuiAlert-icon": { color: "#059669" },
                  }}
                >
                  {success}
                </Alert>
              </Fade>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: textSecondary, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      transition: "all 0.3s ease",
                      "& fieldset": { border: "none" },
                      "&:hover": {
                        borderColor: "#F97316",
                        boxShadow: "0 0 0 4px rgba(249,115,22,0.08)",
                      },
                      "&.Mui-focused": {
                        borderColor: inputBorderFocus,
                        boxShadow: "0 0 0 4px rgba(249,115,22,0.15)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: textSecondary,
                      "&.Mui-focused": { color: "#F97316" },
                    },
                    "& .MuiInputBase-input": {
                      color: textPrimary,
                      py: 1.8,
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  startIcon={!loading && <SendIcon />}
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    bgcolor: "#F97316",
                    color: "#FFFFFF",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      bgcolor: "#EA580C",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 30px rgba(249,115,22,0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&:disabled": {
                      bgcolor: "#FDBA74",
                      color: "#FFFFFF",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transition: "left 0.5s ease",
                    },
                    "&:hover::after": {
                      left: "100%",
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: textSecondary }}>
                  Remember your password?{" "}
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#F97316",
                      textTransform: "none",
                      fontWeight: "bold",
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Box>
    </ThemeProvider>
  );
}