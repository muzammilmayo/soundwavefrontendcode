import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent, Grid, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Chip, Snackbar, Alert,
} from "@mui/material";
import {
  Home as HomeIcon, Flag as FlagIcon, Person as PersonIcon,
  ExitToApp as ExitToAppIcon, CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon, Shield as ShieldIcon,
} from "@mui/icons-material";
import authService from "../../services/authService";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1db954" },
    background: { default: "#121212", paper: "#1c1c1c" },
    text: { primary: "#ffffff", secondary: "#b3b3b3" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial, sans-serif" },
});

const MOCK_REPORTS = [
  { id: 1, type: "Song", title: "Fake Love", reportedBy: "Ali Hassan", reason: "Copyright Violation", status: "Pending" },
  { id: 2, type: "User", title: "John123", reportedBy: "Sara Ali", reason: "Spam / Bot Activity", status: "Reviewed" },
  { id: 3, type: "Playlist", title: "Spam Playlist", reportedBy: "Ahmed Karim", reason: "Inappropriate Content", status: "Pending" },
  { id: 4, type: "Song", title: "Midnight Rain", reportedBy: "Leila Nassar", reason: "Offensive Lyrics", status: "Pending" },
  { id: 5, type: "User", title: "spam_bot_22", reportedBy: "Omar Farouk", reason: "Spam / Bot Activity", status: "Resolved" },
];

export default function ModeratorDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (msg, sev = "success") => setToast({ open: true, message: msg, severity: sev });
  const handleLogout = () => { authService.logout(); navigate("/login"); };

  const handleApprove = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r)));
    showToast("Report marked as resolved.", "success");
  };
  const handleReject = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Dismissed" } : r)));
    showToast("Report dismissed.", "info");
  };

  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
  const dismissedCount = reports.filter((r) => r.status === "Dismissed").length;
  const reviewedCount = reports.filter((r) => r.status === "Reviewed").length;

  const statusColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "Resolved") return "success";
    if (status === "Dismissed") return "default";
    return "info";
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Box sx={{ width: 260, bgcolor: "black", p: 3, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 5, cursor: "pointer", letterSpacing: -1 }}>
            SoundWave
          </Typography>
          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "text.secondary" }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon sx={{ color: "error.main" }}><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>Moderator Dashboard</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Review reports and keep the platform safe.</Typography>
            </Box>
            <Chip icon={<ShieldIcon />} label="Moderator" sx={{ bgcolor: "rgba(29,185,84,0.12)", color: "primary.main", border: "1px solid rgba(29,185,84,0.3)", fontWeight: "bold" }} />
          </Box>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {[
              { label: "Pending Reports", count: pendingCount, color: "warning.main" },
              { label: "Resolved", count: resolvedCount, color: "primary.main" },
              { label: "Reviewed", count: reviewedCount, color: "info.main" },
              { label: "Dismissed", count: dismissedCount, color: "text.secondary" },
            ].map((stat) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                <Card sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold" }}>{stat.label}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, color: stat.color }}>{stat.count}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Recent Reports</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#282828" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Target</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reported By</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell sx={{ color: "text.secondary" }}>{report.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.75rem", fontWeight: "bold" }}>{report.type}</Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600" }}>{report.title}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{report.reportedBy}</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{report.reason}</TableCell>
                    <TableCell><Chip label={report.status} color={statusColor(report.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} /></TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <Button variant="outlined" color="primary" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleApprove(report.id)} disabled={report.status === "Resolved" || report.status === "Dismissed"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>Resolve</Button>
                        <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleReject(report.id)} disabled={report.status === "Resolved" || report.status === "Dismissed"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>Dismiss</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%", borderRadius: 3 }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
