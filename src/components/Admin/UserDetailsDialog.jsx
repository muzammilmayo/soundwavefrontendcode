import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function UserDetailsDialog({
  user,
  onClose,
  onToggleStatus
}) {
  if (!user) return null;
  return (
    <Dialog open={Boolean(user)} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162, 160, 213, 0.2)", minWidth: 400 } }}>
      <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", color: "#FFFFFF" }}>
        User Metadata Details
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { title: "User ID", val: user.user_id, color: "#FFFFFF" },
          { title: "Username", val: user.username || "N/A", color: "#FFFFFF" },
          { title: "Email Address", val: user.email, color: "#FFFFFF" },
          { title: "System Role", val: user.role_name, color: "#01F2EA" },
          { title: "Status", val: user.status || "Active", color: user.status === "Inactive" ? "#EF4444" : "#10B981" },
          { title: "Joined Date", val: user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A", color: "#FFFFFF" },
          { title: "Home Address", val: user.address || "Not Provided", color: "#FFFFFF" },
        ].map((row) => (
          <Box key={row.title} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", pb: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>{row.title}</Typography>
            <Typography sx={{ fontWeight: "bold", color: row.color }}>{row.val}</Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(162, 160, 213, 0.15)" }}>
        <Button variant="contained" fullWidth color={user.status === "Inactive" ? "primary" : "error"} onClick={() => onToggleStatus(user.user_id, user.status || "Active")} sx={{ borderRadius: 3, py: 1, textTransform: "none", fontWeight: "bold" }}>
          {user.status === "Inactive" ? "Activate Account" : "Deactivate Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
