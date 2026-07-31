import React from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress } from "@mui/material";
import StatCard from "./StatCard";

export default function DashboardTab({
  totalUsersCount,
  artistsCount,
  listenersCount,
  activeUsersCount,
  inactiveUsersCount,
  loading,
  users,
  setCurrentTab
}) {
  return (
    <Box>
      {/* Metric Card Rows - Equal Width Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, mb: 5 }}>
        <StatCard title="Total Users" value={totalUsersCount} color="#01F2EA" loading={loading} />
        <StatCard title="Artists Register" value={artistsCount} color="#CE04F2" loading={loading} />
        <StatCard title="Listeners Register" value={listenersCount} color="#6366F1" loading={loading} />
        <StatCard title="Active Statuses" value={activeUsersCount} color="#00BCD4" loading={loading} />
        <StatCard title="Inactive Statuses" value={inactiveUsersCount} color="#F44336" loading={loading} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          Registered Users
        </Typography>
        <Button onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold", color: "#01F2EA", "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
          View All Users &rarr;
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
        ) : users.length === 0 ? (
          <Typography sx={{ p: 4, color: "text.secondary", textAlign: "center" }}>No registered users found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 5).map((user) => (
                <TableRow key={user.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell sx={{ fontWeight: "600", color: "#FFFFFF" }}>{user.username}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "#A2A0D5" }}>
                      {user.role_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status || "Active"} size="small" variant="outlined" color={user.status === "Inactive" ? "error" : "success"} sx={{ fontWeight: "bold", borderRadius: 2 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}
