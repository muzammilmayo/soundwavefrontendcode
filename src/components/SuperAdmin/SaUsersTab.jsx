import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress, Typography } from "@mui/material";
import { Search as SearchIcon, Visibility as VisibilityIcon, DeleteForever as DeleteForeverIcon } from "@mui/icons-material";

export default function UsersTab({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  selectStyles,
  loading,
  filteredUsers,
  setSelectedUser,
  toggleUserStatus,
  setDeleteConfirm
}) {
  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 3, px: 2, border: "1px solid rgba(162, 160, 213, 0.2)" }}>
          <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#FFFFFF", width: "100%", padding: "12px 0", fontSize: 14 }}
          />
        </Box>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="role-sa-select-label" sx={{ color: "text.secondary" }}>Role</InputLabel>
          <Select labelId="role-sa-select-label" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} label="Role" sx={{ borderRadius: 3, ...selectStyles }}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Super Admin">Super Admin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Artist">Artist</MenuItem>
            <MenuItem value="Listener">Listener</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="status-sa-select-label" sx={{ color: "text.secondary" }}>Status</InputLabel>
          <Select labelId="status-sa-select-label" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: 3, ...selectStyles }}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
        {loading ? (
          <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
        ) : filteredUsers.length === 0 ? (
          <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No users match your criteria.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((SaUser) => (
                <TableRow key={SaUser.user_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell sx={{ fontWeight: "600" }}>{SaUser.username}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{SaUser.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "#A2A0D5" }}>
                      {SaUser.role_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={SaUser.status || "Active"} size="small" variant="outlined" color={SaUser.status === "Inactive" ? "error" : "success"} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Tooltip title="View Details">
                        <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={() => setSelectedUser(SaUser)} sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(162,160,213,0.3)", color: "#A2A0D5", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}>
                          View
                        </Button>
                      </Tooltip>
                      <Button variant="outlined" color={SaUser.status === "Inactive" ? "primary" : "error"} size="small" onClick={() => toggleUserStatus(SaUser.user_id, SaUser.status || "Active")} sx={{ textTransform: "none", borderRadius: 2 }}>
                        {SaUser.status === "Inactive" ? "Activate" : "Deactivate"}
                      </Button>
                      <Button variant="outlined" color="error" size="small" startIcon={<DeleteForeverIcon />} onClick={() => setDeleteConfirm({ open: true, user: SaUser })} sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(220,38,38,0.3)" }}>
                        Delete
                      </Button>
                    </Box>
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
