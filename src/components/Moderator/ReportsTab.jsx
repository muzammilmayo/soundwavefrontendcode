import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";

export default function ReportsTab({
  reports,
  getStatusColor,
  handleResolveReport,
  handleDismissReport
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
      <Table>
        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Reporter</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Type</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Target Details</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Reason</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                No reports submitted yet. The system is clean!
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.report_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                <TableCell>{report.report_id}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{report.reporter}</TableCell>
                <TableCell>
                  <Chip label={report.target_type.toUpperCase()} size="small" sx={{ bgcolor: "rgba(206,4,242,0.1)", color: "#CE04F2", border: "1px solid rgba(206,4,242,0.3)", fontWeight: "bold", fontSize: "0.7rem" }} />
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>{report.title}</TableCell>
                <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{report.reason}</TableCell>
                <TableCell>
                  <Chip label={report.status} color={getStatusColor(report.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button variant="outlined" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleResolveReport(report.report_id)} disabled={report.status !== "pending"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>
                      Resolve
                    </Button>
                    <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleDismissReport(report.report_id)} disabled={report.status !== "pending"} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}>
                      Dismiss
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
