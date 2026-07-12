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
} from "@mui/icons-material";
import authService from "../services/authService";

// ===== HARDCODED NEON DARK THEME =====
const synthTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#01F2EA" }, // Neon Cyan
    background: { default: "#100B29", paper: "#1A153A" }, // Deep Purple Theme Colors
    text: { primary: "#FFFFFF", secondary: "#A2A0D5" }, // Crisp White & Soft Lavender
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    <ThemeProvider theme={synthTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
          position: "relative",
          overflow: "hidden",
          // Digital mesh background pattern matching the other panels
          backgroundImage:
            "linear-gradient(#201948 1px, transparent 1px), linear-gradient(90deg, #201948 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Ambient Neon Background Glows */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(1,242,234,0.06) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(206,4,242,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Back Button */}
        <Button
          onClick={() => navigate("/login")}
          startIcon={<ArrowBackIcon />}
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            color: "text.secondary",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 3,
            px: 2,
            py: 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: "#01F2EA",
              bgcolor: "rgba(1, 242, 234, 0.05)",
              boxShadow: "0 0 12px rgba(1, 242, 234, 0.2)",
            },
          }}
        >
          Back to Login
        </Button>

        {/* Main Card Container */}
        <Slide direction="up" in={true} timeout={500}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 4,
              border: "1px solid rgba(162, 160, 213, 0.2)",
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              position: "relative",
              zIndex: 1,
              overflow: "visible",
            }}
          >
            {/* Top Cyan Neon Accent Strip */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                bgcolor: "#01F2EA",
                borderRadius: "4px 4px 0 0",
                boxShadow: "0 2px 10px rgba(1, 242, 234, 0.4)",
              }}
            />

            <CardContent sx={{ p: 5 }}>
              {/* Reset Lock Icon (Glowing Neon Circle) */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(1, 242, 234, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 15px rgba(1, 242, 234, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05) rotate(-5deg)",
                    borderColor: "#01F2EA",
                    boxShadow: "0 0 20px rgba(1, 242, 234, 0.3)",
                  },
                }}
              >
                <LockResetIcon sx={{ fontSize: 36, color: "#01F2EA", filter: "drop-shadow(0 0 6px #01F2EA)" }} />
              </Box>

              {/* Headings */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#FFFFFF",
                  mb: 1,
                  letterSpacing: -0.5,
                }}
              >
                Forgot Password?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                No worries! Enter your registered email address below and we'll send you a secure link to reset your password.
              </Typography>

              {/* Response Alerts */}
              <Fade in={Boolean(error)}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    color: "#EF4444",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    "& .MuiAlert-icon": { color: "#EF4444" },
                  }}
                >
                  {error}
                </Alert>
              </Fade>

              <Fade in={Boolean(success)}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "#10B981",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    "& .MuiAlert-icon": { color: "#10B981" },
                  }}
                >
                  {success}
                </Alert>
              </Fade>

              {/* Interactive Text Input */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    mb: 3,
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
                      py: 1.8,
                    },
                  }}
                />

                {/* Cyberpunk Animated Action Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  startIcon={!loading && <SendIcon />}
                  sx={{
                    py: 1.6,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    bgcolor: "#01F2EA",
                    color: "#100B29",
                    boxShadow: "0 4px 14px rgba(1, 242, 234, 0.3)",
                    transition: "all 0.25s ease-out",
                    overflow: "hidden",
                    "&:hover": {
                      bgcolor: "#00DDD5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(1, 242, 234, 0.5)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transition: "left 0.6s ease",
                    },
                    "&:hover::after": {
                      left: "100%",
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>

              {/* Redirect Action Footer Links */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Remember your password?{" "}
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#CE04F2", // Neon Magenta Link Text color
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