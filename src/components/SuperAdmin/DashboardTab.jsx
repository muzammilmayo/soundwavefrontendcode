import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, Chip, CircularProgress } from "@mui/material";

export default function DashboardTab({
  totalUsersCount,
  onlineUsersCount,
  SaAdminsCount,
  adminsCount,
  artistsCount,
  listenerCount,
  activeUsersCount,
  inactiveUsersCount,
  loading,
  users,
  setCurrentTab
}) {
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
        {[
          { title: "Total Users", value: totalUsersCount, color: "#FFFFFF", tab: "users" },
          { title: "Online Users", value: onlineUsersCount, color: "#10B981", tab: "online-users" },
          { title: "System Admins", value: adminsCount, color: "#01F2EA" },
          { title: "Artists Registered", value: artistsCount, color: "#CE04F2", tab: "artists" },
          { title: "Listener Registered", value: listenerCount, color: "#A2A0D5", tab: "users" },
          { title: "Active Statuses", value: activeUsersCount, color: "#00BCD4", tab: "users" },
          { title: "Inactive Statuses", value: inactiveUsersCount, color: "#F44336", tab: "users" },
        ].map((stat) => (
          <Card key={stat.title} onClick={() => stat.tab && setCurrentTab(stat.tab)} sx={{ 
            height: "100%", 
             SaAdminsCount: 1, 
            display: "flex", 
            flexDirection: "column", 
            borderRadius: 4, 
            border: "1px solid rgba(162, 160, 213, 0.15)", 
            bgcolor: "background.paper", 
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)", 
            minHeight: 160,
            cursor: stat.tab ? "pointer" : "default",
            transition: "all 0.25s", 
            "&:hover": { 
              transform: "translateY(-2px)", 
              borderColor: stat.color !== "#FFFFFF" ? stat.color : "rgba(162, 160, 213, 0.4)" 
            } 
          }}>
            <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.7rem" }}>
                {stat.title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1.5, color: stat.color }}>
                {loading ? <CircularProgress size={24} /> : stat.value.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          Recent Registered Users
        </Typography>
        <Button onClick={() => setCurrentTab("users")} sx={{ textTransform: "none", fontWeight: "bold", color: "#01F2EA", "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
          View All Users →
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", overflow: "hidden" }}>
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
              {users.slice(0, 5).map((SaUser) => (
                <TableRow key={SaUser.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell sx={{ fontWeight: "600", color: "#FFFFFF" }}>{SaUser.username}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{SaUser.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "#A2A0D5" }}>
                      {SaUser.role_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={SaUser.status || "Active"} size="small" variant="outlined" color={SaUser.status === "Inactive" ? "error" : "success"} />
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
