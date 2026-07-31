import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

export default function ArtistsTab({
  catalogArtists,
  handleDeleteArtistProfile
}) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
        Catalog Artists Management
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
        {catalogArtists.length === 0 ? (
          <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No artist profiles found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Artist Info</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Biography</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {catalogArtists.map((artist) => (
                <TableRow key={artist.artist_profile_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                        {artist.profile_image ? <Box component="img" src={artist.profile_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <PersonIcon sx={{ color: "#01F2EA" }} />}
                      </Box>
                      <Typography sx={{ fontWeight: "600" }}>{artist.stage_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{artist.User?.username || "N/A"}</TableCell>
                  <TableCell sx={{ color: "text.secondary", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artist.bio || "No biography provided."}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteArtistProfile(artist.user_id)} sx={{ textTransform: "none", borderRadius: 2 }}>
                      Delete Profile
                    </Button>
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
