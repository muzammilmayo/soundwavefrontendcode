import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  LinearProgress,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import axios from "axios";

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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
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

  // Password strength
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthColor = ["#EF4444", "#F97316", "#F59E0B", "#10B981", "#059669"];
  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthPercent = (strength / 5) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { newPassword }
      );
      setSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
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
                <LockIcon sx={{ fontSize: 32, color: "#F97316" }} />
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
                Reset Password
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
                Create a new secure password for your account.
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
                  icon={<CheckCircleIcon />}
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
                {/* New Password */}
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: textSecondary, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: textSecondary }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    mb: newPassword ? 1 : 3,
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
                        borderColor: "#F97316",
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

                {/* Password Strength */}
                {newPassword && (
                  <Fade in={true}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 500 }}>
                          Password Strength
                        </Typography>
                        <Typography variant="caption" sx={{ color: strengthColor[strength - 1] || "#EF4444", fontWeight: "bold" }}>
                          {strengthLabel[strength - 1] || "Very Weak"}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={strengthPercent}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: darkMode ? "#334155" : "#F1F5F9",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: strengthColor[strength - 1] || "#EF4444",
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                          },
                        }}
                      />
                    </Box>
                  </Fade>
                )}

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  type={showConfirm ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  error={confirmPassword && newPassword !== confirmPassword}
                  helperText={confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : ""}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: textSecondary, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                            edge="end"
                            sx={{ color: textSecondary }}
                          >
                            {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
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
                        borderColor: "#F97316",
                        boxShadow: "0 0 0 4px rgba(249,115,22,0.15)",
                      },
                      "&.Mui-error": {
                        borderColor: "#EF4444",
                        boxShadow: "0 0 0 4px rgba(239,68,68,0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: textSecondary,
                      "&.Mui-focused": { color: "#F97316" },
                      "&.Mui-error": { color: "#EF4444" },
                    },
                    "& .MuiInputBase-input": {
                      color: textPrimary,
                      py: 1.8,
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#EF4444",
                      fontWeight: 500,
                      mt: 0.5,
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  startIcon={!loading && <CheckCircleIcon />}
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
                  {loading ? "Resetting..." : "Reset Password"}
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
