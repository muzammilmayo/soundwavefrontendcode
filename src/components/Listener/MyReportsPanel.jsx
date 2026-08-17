import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import api from "../../api";

export default function MyReportsPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports");
      setReports(res.data.data || []);
    } catch (err) {
      console.error("Error loading my reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleViewDetails = async (reportId) => {
    setSelectedReport(reportId);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/reports/${reportId}`);
      setReportDetails(res.data.data);
    } catch (err) {
      console.error("Error loading report details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
    setReportDetails(null);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "rgba(245,158,11,0.12)", color: "#F59E0B" }; // Amber
      case "Under Review":
        return { bgcolor: "rgba(59,130,246,0.12)", color: "#3B82F6" }; // Blue
      case "Resolved":
        return { bgcolor: "rgba(16,185,129,0.12)", color: "#10B981" }; // Green
      case "Rejected":
        return { bgcolor: "rgba(239,68,68,0.12)", color: "#EF4444" }; // Red
      case "Closed":
      default:
        return { bgcolor: "rgba(107,114,128,0.12)", color: "#6B7280" }; // Gray
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <FlagIcon sx={{ color: "#01F2EA", fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          My Support & Content Reports
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
      ) : reports.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
          <Typography sx={{ color: "text.secondary" }}>You haven't filed any reports yet.</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
              <TableRow>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Reference ID</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Report Type</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Reason</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Date Created</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold", textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => {
                const styles = getStatusChipColor(report.status);
                return (
                  <TableRow key={report.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.01)" } }}>
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 500 }}>#{report.id}</TableCell>
                    <TableCell sx={{ color: "#FFFFFF", textTransform: "capitalize" }}>{report.report_type}</TableCell>
                    <TableCell sx={{ color: "#A2A0D5" }}>{report.reason}</TableCell>
                    <TableCell>
                      <Chip label={report.status} size="small" sx={{ bgcolor: styles.bgcolor, color: styles.color, fontWeight: "bold" }} />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleViewDetails(report.id)}
                        sx={{ borderRadius: 2, textTransform: "none", borderColor: "rgba(1, 242, 234, 0.3)", color: "#01F2EA", "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1, 242, 234, 0.05)" } }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog open={selectedReport !== null} onClose={handleCloseDetails} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)", borderRadius: 4, color: "#FFFFFF" } }}>
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.1)", pb: 2 }}>
          Report Details (Ref #{selectedReport})
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {detailsLoading || !reportDetails ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Basic Meta */}
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Report Type</Typography>
                  <Typography sx={{ textTransform: "capitalize", fontWeight: "bold" }}>{reportDetails.report.report_type}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Current Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip 
                      label={reportDetails.report.status} 
                      size="small" 
                      sx={getStatusChipColor(reportDetails.report.status)} 
                    />
                  </Box>
                </Box>
              </Box>

              {/* Target Preview */}
              {reportDetails.targetDetails && (
                <Box sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 3, border: "1px solid rgba(162,160,213,0.1)" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>Reported Item Information</Typography>
                  {reportDetails.report.report_type === "song" || reportDetails.report.report_type === "album" ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 1.5, overflow: "hidden", bgcolor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {reportDetails.targetDetails.cover_image && <Box component="img" src={reportDetails.targetDetails.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: "bold" }}>{reportDetails.targetDetails.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>by {reportDetails.targetDetails.artist}</Typography>
                      </Box>
                    </Box>
                  ) : reportDetails.report.report_type === "comment" ? (
                    <Box>
                      <Typography sx={{ fontStyle: "italic", mb: 1 }}>"{reportDetails.targetDetails.comment}"</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>On track: <strong>{reportDetails.targetDetails.song_title}</strong> by {reportDetails.targetDetails.username}</Typography>
                    </Box>
                  ) : reportDetails.report.report_type === "artist" ? (
                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>{reportDetails.targetDetails.stage_name}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>{reportDetails.targetDetails.bio || "No bio updated."}</Typography>
                    </Box>
                  ) : reportDetails.report.report_type === "user" ? (
                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>{reportDetails.targetDetails.username}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>Email: {reportDetails.targetDetails.email}</Typography>
                    </Box>
                  ) : null}
                </Box>
              )}

              {/* Reason & Description */}
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Reason Given</Typography>
                <Typography sx={{ fontWeight: "bold", mb: 1.5 }}>{reportDetails.report.reason}</Typography>
                
                {reportDetails.report.description && (
                  <>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>User Description</Typography>
                    <Typography sx={{ color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.01)", p: 1.5, borderRadius: 2, border: "1px solid rgba(162,160,213,0.05)" }}>
                      {reportDetails.report.description}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Resolution Notes */}
              {reportDetails.report.resolution && (
                <Box sx={{ p: 2, bgcolor: "rgba(16,185,129,0.05)", borderRadius: 3, border: "1px solid rgba(16,185,129,0.2)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#10B981", mb: 0.5 }}>Resolution Outcome</Typography>
                  <Typography sx={{ color: "#FFFFFF" }}>{reportDetails.report.resolution}</Typography>
                </Box>
              )}

              {/* History / Audit Log */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "#A2A0D5" }}>Activity Audit Trail</Typography>
                <Divider sx={{ mb: 1.5, borderColor: "rgba(162,160,213,0.1)" }} />
                <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {reportDetails.report.ReportHistories?.map((h) => (
                    <ListItem key={h.id} disablePadding sx={{ alignItems: "flex-start", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 0.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#01F2EA" }}>
                          {h.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {new Date(h.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                      <ListItemText 
                        primary={<Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>{h.notes}</Typography>} 
                        secondary={h.User ? <Typography variant="caption" sx={{ color: "rgba(162,160,213,0.4)", display: "block", mt: 0.5 }}>{`Updated by: ${h.User.username}`}</Typography> : null}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid rgba(162,160,213,0.1)", p: 2 }}>
          <Button onClick={handleCloseDetails} variant="contained" sx={{ borderRadius: 2, bgcolor: "#01F2EA", color: "#100B29", fontWeight: "bold", "&:hover": { bgcolor: "#00CFCE" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
