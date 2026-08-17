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
  Divider,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import SearchIcon from "@mui/icons-material/Search";
import ShieldIcon from "@mui/icons-material/Shield";
import api from "../../api";

export default function PlatformReportsPanel({ showToast }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Actions form state
  const [actionNotes, setActionNotes] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports");
      setReports(res.data.data || []);
      setFilteredReports(res.data.data || []);
    } catch (err) {
      console.error("Error loading moderator reports:", err);
      if (showToast) showToast("Failed to load reports.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = reports;

    if (statusFilter !== "All") {
      result = result.filter(r => r.status === statusFilter);
    }

    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(r => 
        String(r.id).includes(query) || 
        r.reason.toLowerCase().includes(query) || 
        r.report_type.toLowerCase().includes(query)
      );
    }

    setFilteredReports(result);
  }, [search, statusFilter, reports]);

  const handleOpenDetails = async (reportId) => {
    setSelectedReport(reportId);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/reports/${reportId}`);
      setReportDetails(res.data.data);
      setStatusUpdate(res.data.data.report.status);
      setActionNotes("");
    } catch (err) {
      console.error("Error loading details:", err);
      if (showToast) showToast("Failed to load report details.", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
    setReportDetails(null);
  };

  const handleStatusChangeSubmit = async () => {
    if (!statusUpdate) return;
    setActionLoading(true);
    try {
      await api.put(`/reports/${selectedReport}/status`, {
        status: statusUpdate,
        notes: actionNotes.trim() || `Status updated by platform moderator.`
      });
      if (showToast) showToast("Report status updated.", "success");
      handleOpenDetails(selectedReport);
      fetchReports();
    } catch (err) {
      console.error("Error updating status:", err);
      if (showToast) showToast(err.response?.data?.message || "Failed to update status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleModerationAction = async (actionName) => {
    setActionLoading(true);
    try {
      const res = await api.post(`/reports/${selectedReport}/action`, {
        action: actionName,
        notes: actionNotes.trim()
      });
      if (showToast) showToast(res.data.message || "Action executed successfully.", "success");
      handleOpenDetails(selectedReport);
      fetchReports();
    } catch (err) {
      console.error("Error executing moderation action:", err);
      if (showToast) showToast(err.response?.data?.message || "Failed to execute action.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalateReport = async () => {
    setActionLoading(true);
    try {
      await api.put(`/reports/${selectedReport}/status`, {
        assigned_role: "Admin",
        status: "Under Review",
        notes: actionNotes.trim() || "Escalated to administrator review."
      });
      if (showToast) showToast("Report successfully escalated to Admin.", "success");
      handleCloseDetails();
      fetchReports();
    } catch (err) {
      console.error("Error escalating report:", err);
      if (showToast) showToast(err.response?.data?.message || "Failed to escalate report.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "rgba(245,158,11,0.12)", color: "#F59E0B" };
      case "Under Review":
        return { bgcolor: "rgba(59,130,246,0.12)", color: "#3B82F6" };
      case "Resolved":
        return { bgcolor: "rgba(16,185,129,0.12)", color: "#10B981" };
      case "Rejected":
        return { bgcolor: "rgba(239,68,68,0.12)", color: "#EF4444" };
      case "Closed":
      default:
        return { bgcolor: "rgba(107,114,128,0.12)", color: "#6B7280" };
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      color: "#FFFFFF",
      bgcolor: "rgba(255, 255, 255, 0.02)",
      "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
      "&:hover fieldset": { borderColor: "#01F2EA" },
      "&.Mui-focused fieldset": { borderColor: "#01F2EA" }
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShieldIcon sx={{ color: "#01F2EA", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
            Platform Moderation Queue
          </Typography>
        </Box>
        <Chip label="Platform Moderator Mode" color="secondary" sx={{ fontWeight: "bold" }} />
      </Box>

      {/* Search and status filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ color: "#A2A0D5", mr: 1, fontSize: 20 }} />
            }
          }}
          sx={{ flexGrow: 1, maxWidth: 400, ...textFieldStyles }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 180, ...textFieldStyles }}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Under Review">Under Review</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
      ) : filteredReports.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
          <Typography sx={{ color: "text.secondary" }}>No reports in your queue.</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
              <TableRow>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Reporter</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Reason</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold" }}>Date Created</TableCell>
                <TableCell sx={{ color: "#A2A0D5", fontWeight: "bold", textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => {
                const styles = getStatusChipColor(report.status);
                return (
                  <TableRow key={report.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.01)" } }}>
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>#{report.id}</TableCell>
                    <TableCell sx={{ color: "#FFFFFF" }}>{report.Reporter?.username || `User #${report.reporter_id}`}</TableCell>
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
                        onClick={() => handleOpenDetails(report.id)}
                        sx={{ borderRadius: 2, textTransform: "none", borderColor: "rgba(1, 242, 234, 0.3)", color: "#01F2EA", "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1, 242, 234, 0.05)" } }}
                      >
                        Review
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
      <Dialog open={selectedReport !== null} onClose={handleCloseDetails} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)", borderRadius: 4, color: "#FFFFFF" } }}>
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.1)", pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Report Details (Ref #{selectedReport})</Typography>
          <Button onClick={handleCloseDetails} sx={{ color: "text.secondary", textTransform: "none" }}>Close</Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {detailsLoading || !reportDetails ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3}>
              {/* Left Metadata & Resource View */}
              <Grid item xs={12} md={7}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>Reporter Username</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>{reportDetails.report.Reporter ? reportDetails.report.Reporter.username : `User #${reportDetails.report.reporter_id}`}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>Reason Category</Typography>
                      <Typography sx={{ fontWeight: "bold", color: "#EF4444" }}>{reportDetails.report.reason}</Typography>
                    </Box>
                  </Box>

                  {/* Resource details */}
                  {reportDetails.targetDetails && (
                    <Box sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 3, border: "1px solid rgba(162,160,213,0.1)" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>Reported Target Details</Typography>
                      {reportDetails.report.report_type === "artist" ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", bgcolor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {reportDetails.targetDetails.profile_image && <Box component="img" src={reportDetails.targetDetails.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: "bold" }}>{reportDetails.targetDetails.stage_name}</Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>Bio: {reportDetails.targetDetails.bio || "No biography added."}</Typography>
                            <Box sx={{ mt: 0.5 }}><Chip label={`Status: ${reportDetails.targetDetails.status || "active"}`} size="small" sx={{ height: 18, fontSize: "0.65rem" }} /></Box>
                          </Box>
                        </Box>
                      ) : reportDetails.report.report_type === "user" ? (
                        <Box>
                          <Typography sx={{ fontWeight: "bold" }}>{reportDetails.targetDetails.username}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Email: {reportDetails.targetDetails.email}</Typography>
                          <Box sx={{ mt: 0.5 }}><Chip label={`Status: ${reportDetails.targetDetails.status || "active"}`} size="small" sx={{ height: 18, fontSize: "0.65rem" }} /></Box>
                        </Box>
                      ) : null}
                    </Box>
                  )}

                  {/* Description */}
                  {reportDetails.report.description && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>Report Description</Typography>
                      <Typography sx={{ color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.01)", p: 1.5, borderRadius: 2, border: "1px solid rgba(162,160,213,0.05)" }}>
                        {reportDetails.report.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Audit trail list */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "#A2A0D5" }}>Action Audit Log Trail</Typography>
                    <Divider sx={{ mb: 1.5, borderColor: "rgba(162,160,213,0.1)" }} />
                    <List sx={{ p: 0, maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                            primary={h.notes} 
                            primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                            secondary={h.User ? `Updated by: ${h.User.username}` : null}
                            secondaryTypographyProps={{ variant: "caption", sx: { color: "rgba(162,160,213,0.4)" } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Grid>

              {/* Right Actions Panel */}
              <Grid item xs={12} md={5} sx={{ borderLeft: "1px solid rgba(162,160,213,0.1)", pl: { md: 3 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2, color: "#A2A0D5" }}>Resolution & Moderation Actions</Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                  
                  <Box>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Report Status"
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      sx={textFieldStyles}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Action Notes"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add internal notes explaining this action..."
                      sx={textFieldStyles}
                    />
                  </Box>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleStatusChangeSubmit}
                    disabled={actionLoading || statusUpdate === reportDetails.report.status}
                    sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#01F2EA", color: "#100B29", fontWeight: "bold", "&:hover": { bgcolor: "#00CFCE" } }}
                  >
                    Save Status Update
                  </Button>

                  <Divider sx={{ borderColor: "rgba(162,160,213,0.1)" }} />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Execute Safety Actions</Typography>
                    
                    {reportDetails.report.report_type === "user" && (
                      <>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("warn_user")}
                          disabled={actionLoading}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#F59E0B", color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          Issue Warning to User
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("suspend_user")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "suspended"}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#EF4444", fontWeight: "bold" }}
                        >
                          Suspend User Account
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("ban_user")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "banned"}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#B91C1C", fontWeight: "bold" }}
                        >
                          Ban User Account
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="success" 
                          fullWidth
                          onClick={() => handleModerationAction("approve_user")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "active"}
                          sx={{ textTransform: "none", borderRadius: 2, borderColor: "#10B981", color: "#10B981", fontWeight: "bold", "&:hover": { borderColor: "#10B981", bgcolor: "rgba(16,185,129,0.05)" } }}
                        >
                          Override: Lift Suspension / Ban
                        </Button>
                      </>
                    )}

                    {reportDetails.report.report_type === "artist" && (
                      <>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("warn_artist")}
                          disabled={actionLoading}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#F59E0B", color: "#FFFFFF", fontWeight: "bold" }}
                        >
                          Issue Warning to Artist
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("suspend_artist")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "suspended"}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#EF4444", fontWeight: "bold" }}
                        >
                          Suspend Artist Account
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          fullWidth
                          onClick={() => handleModerationAction("ban_artist")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "banned"}
                          sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#B91C1C", fontWeight: "bold" }}
                        >
                          Ban Artist Account
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="success" 
                          fullWidth
                          onClick={() => handleModerationAction("approve_artist")}
                          disabled={actionLoading || reportDetails.targetDetails?.status === "active"}
                          sx={{ textTransform: "none", borderRadius: 2, borderColor: "#10B981", color: "#10B981", fontWeight: "bold", "&:hover": { borderColor: "#10B981", bgcolor: "rgba(16,185,129,0.05)" } }}
                        >
                          Override: Lift Suspension / Ban
                        </Button>
                      </>
                    )}

                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={handleEscalateReport}
                      disabled={actionLoading}
                      sx={{ textTransform: "none", borderRadius: 2, borderColor: "#01F2EA", color: "#01F2EA", fontWeight: "bold", "&:hover": { borderColor: "#01F2EA", bgcolor: "rgba(1,242,234,0.05)" } }}
                    >
                      Escalate to Administrator
                    </Button>
                  </Box>

                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
