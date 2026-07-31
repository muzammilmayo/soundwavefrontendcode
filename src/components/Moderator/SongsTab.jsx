import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { MusicNote as MusicNoteIcon } from "@mui/icons-material";

export default function SongsTab({
  songs,
  getStatusColor,
  handleToggleSongStatus
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
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Plays</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#01F2EA", textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                No songs found.
              </TableCell>
            </TableRow>
          ) : (
            songs.map((song) => (
              <TableRow key={song.song_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>
                <TableCell>{song.song_id}</TableCell>
                <TableCell>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(162,160,213,0.15)", bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {song.cover_image ? <img src={song.cover_image} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 18 }} />}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{song.title}</TableCell>
                <TableCell>{song.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                <TableCell>{song.Category?.name || "Uncategorized"}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#CE04F2" }}>{song.play_count || 0}</TableCell>
                <TableCell>
                  <Chip label={song.status} color={getStatusColor(song.status)} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem" }} />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color={song.status === "moderated" ? "primary" : "error"}
                    size="small"
                    onClick={() => handleToggleSongStatus(song.song_id, song.status)}
                    sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.75rem" }}
                  >
                    {song.status === "moderated" ? "Restore / Approve" : "Lock / Ban Track"}
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
