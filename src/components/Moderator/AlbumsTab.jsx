import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { Album as AlbumIcon } from "@mui/icons-material";

export default function AlbumsTab({
  albums,
  getStatusColor,
  handleToggleAlbumStatus
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
      <Table>
        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Cover</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Artist</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Release Date</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                No albums found.
              </TableCell>
            </TableRow>
          ) : (
            albums.map((album) => (
              <TableRow key={album.album_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                <TableCell>{album.album_id}</TableCell>
                <TableCell>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {album.cover_image ? <img src={album.cover_image} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AlbumIcon sx={{ color: "#01F2EA", fontSize: 18 }} />}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{album.title}</TableCell>
                <TableCell>{album.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                <TableCell>{album.release_date || "N/A"}</TableCell>
                <TableCell>
                  <Chip label={album.status} color={getStatusColor(album.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color={album.status === "moderated" ? "primary" : "error"}
                    size="small"
                    onClick={() => handleToggleAlbumStatus(album.album_id, album.status)}
                    sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                  >
                    {album.status === "moderated" ? "Restore / Approve" : "Lock / Ban Album"}
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
