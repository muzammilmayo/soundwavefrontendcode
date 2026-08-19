import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Avatar,
  Badge,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function OnlineUsersTab({
  onlineUsers,
  selectStyles,
  loading,
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredOnlineUsers = onlineUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role_name === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Admin":
        return "linear-gradient(135deg, #01F2EA, #00A3A6)";
      case "Artist":
        return "linear-gradient(135deg, #CE04F2, #7B0291)";
      case "Listener":
        return "linear-gradient(135deg, #A2A0D5, #5A5885)";
      default:
        return "linear-gradient(135deg, #616161, #212121)";
    }
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#10B981",
              boxShadow: "0 0 10px #10B981",
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Currently Online Users
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Live session monitor — updates in real time as users log in and out
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${onlineUsers.length} Active Now`}
          sx={{
            bgcolor: "#10B981",
            color: "#100B29",
            fontWeight: "bold",
            fontSize: "0.8rem",
            px: 1,
          }}
        />
      </Box>

      {/* Search & Filter Bar */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            px: 2,
            border: "1px solid rgba(162, 160, 213, 0.2)",
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
          <input
            type="text"
            placeholder="Search online users by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#FFFFFF",
              width: "100%",
              padding: "12px 0",
              fontSize: 14,
            }}
          />
        </Box>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="online-role-select-label" sx={{ color: "text.secondary" }}>
            Filter Role
          </InputLabel>
          <Select
            labelId="online-role-select-label"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Filter Role"
            sx={{ borderRadius: 3, ...selectStyles }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Super Admin">Super Admin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Artist">Artist</MenuItem>
            <MenuItem value="Listener">Listener</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Online Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          border: "1px solid rgba(162, 160, 213, 0.15)",
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredOnlineUsers.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              {onlineUsers.length === 0
                ? "No users are currently online."
                : "No online users match your search criteria."}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Active users will appear here automatically when they log into SoundWave.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Gmail</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Online Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Account Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOnlineUsers.map((user) => (
                <TableRow
                  key={user.user_id}
                  hover
                  sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: "#10B981",
                            boxShadow: "0 0 6px #10B981",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            background: getAvatarColor(user.role_name),
                          }}
                        >
                          {getInitials(user.username)}
                        </Avatar>
                      </Badge>
                      <Typography sx={{ fontWeight: "600", color: "#FFFFFF" }}>
                        {user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.05)",
                        fontSize: "0.75rem",
                        color: "#A2A0D5",
                      }}
                    >
                      {user.role_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#10B981",
                            boxShadow: "0 0 8px #10B981",
                            display: "inline-block",
                            ml: 0.5,
                            mr: -0.5,
                          }}
                        />
                      }
                      label="Online"
                      size="small"
                      sx={{
                        bgcolor: "rgba(16, 185, 129, 0.15)",
                        color: "#10B981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status || "Active"}
                      size="small"
                      variant="outlined"
                      color={user.status === "Inactive" ? "error" : "success"}
                    />
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
