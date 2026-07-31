import React from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";

export default function UsersTab({
  users,
  getStatusColor,
  handleToggleUserStatus
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
      <Table>
        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>User ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Username</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Role</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((item) => (
              <TableRow key={item.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                <TableCell>{item.user_id}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{item.username}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Chip label={item.role_name || "Listener"} size="small" sx={{ bgcolor: "rgba(1,242,234,0.05)", color: "#01F2EA" }} />
                </TableCell>
                <TableCell>
                  <Chip label={item.status || "Active"} color={getStatusColor(item.status || "Active")} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color={item.status === "Inactive" ? "success" : "error"}
                    size="small"
                    onClick={() => handleToggleUserStatus(item.user_id, item.status || "Active")}
                    disabled={item.role_name === "Super Admin" || item.user_id === 1} // Prevent locking Super Admins
                    sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                  >
                    {item.status === "Inactive" ? "Activate Account" : "Lock / Deactivate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
