import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from "@mui/material";
import { MusicNote as MusicNoteIcon } from "@mui/icons-material";

export default function SongsTab({
  catalogSongs,
  handleDeleteSong
}) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
        Catalog Songs Management
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
        {catalogSongs.length === 0 ? (
          <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No songs found in catalog.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Song Info</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Artist</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Album</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {catalogSongs.map((song) => (
                <TableRow key={song.song_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                        {song.cover_image ? <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                      </Box>
                      <Typography sx={{ fontWeight: "600" }}>{song.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{song.ArtistProfile?.stage_name || "Unknown Artist"}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{song.Album?.title || "Single"}</TableCell>
                  <TableCell>
                    {song.Category?.name && <Chip label={song.Category.name} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteSong(song.song_id)} sx={{ textTransform: "none", borderRadius: 2 }}>
                      Delete Song
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
