// src/components/Listener/LyricsPanel.jsx
// Slide-up overlay panel that displays song lyrics in the Music Player.
// Handles pending ("Lyrics are being generated..."), completed (scrollable lyrics text),
// and failed ("Lyrics are currently unavailable.") states, polling automatically while pending.

import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress, Paper, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import api from "../../api";

export default function LyricsPanel({ open, onClose, currentSong }) {
  const [lyricsData, setLyricsData] = useState({ lyrics: null, lyrics_status: "none", lyrics_error: null });
  const [loading, setLoading] = useState(false);

  const fetchLyrics = async (songId) => {
    if (!songId) return;
    try {
      const res = await api.get(`/lyrics/songs/${songId}`);
      if (res.data?.success) {
        setLyricsData(res.data.data);
      }
    } catch (err) {
      console.error("[LyricsPanel] Error fetching lyrics:", err);
      setLyricsData({ lyrics: null, lyrics_status: "failed", lyrics_error: "Failed to fetch lyrics" });
    }
  };

  // Initial load when open or currentSong changes
  useEffect(() => {
    if (open && currentSong) {
      const songId = currentSong.song_id || currentSong.id;
      setLoading(true);
      fetchLyrics(songId).finally(() => setLoading(false));
    }
  }, [open, currentSong]);

  // Auto-polling when status is pending or processing
  useEffect(() => {
    let interval;
    const songId = currentSong?.song_id || currentSong?.id;
    const status = lyricsData.lyrics_status;

    if (open && songId && (status === "pending" || status === "processing")) {
      interval = setInterval(() => {
        fetchLyrics(songId);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [open, currentSong, lyricsData.lyrics_status]);

  if (!open) return null;

  const status = lyricsData.lyrics_status || "none";
  const lyricsText = lyricsData.lyrics;

  return (
    <Fade in={open}>
      <Paper
        elevation={24}
        sx={{
          position: "fixed",
          bottom: 95, // Positioned right above the bottom MusicPlayer bar (height 95)
          right: 24,
          width: { xs: "90%", sm: 420 },
          maxHeight: 520,
          bgcolor: "rgba(20, 14, 52, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(1, 242, 234, 0.3)",
          borderRadius: 4,
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -8px 32px rgba(1, 242, 234, 0.2), 0 12px 32px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Panel Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(162, 160, 213, 0.15)",
            bgcolor: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LibraryMusicIcon sx={{ color: "#01F2EA", fontSize: 24 }} />
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.05rem", color: "#FFFFFF", lineHeight: 1.2 }}>
                Lyrics
              </Typography>
              <Typography variant="caption" sx={{ color: "#A2A0D5", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: 260, whiteSpace: "nowrap" }}>
                {currentSong?.title} {currentSong?.ArtistProfile?.stage_name ? `• ${currentSong.ArtistProfile.stage_name}` : ""}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", "&:hover": { color: "#FFFFFF" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Panel Body */}
        <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: loading || status === "pending" || status === "processing" || status === "failed" || !lyricsText ? "center" : "flex-start" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#01F2EA", mb: 2 }} />
              <Typography variant="body2" sx={{ color: "#A2A0D5" }}>
                Loading lyrics...
              </Typography>
            </Box>
          ) : status === "pending" || status === "processing" ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={36} sx={{ color: "#01F2EA", mb: 2 }} />
              <Typography sx={{ fontWeight: "bold", color: "#01F2EA", fontSize: "1rem", mb: 0.5 }}>
                Lyrics are being generated...
              </Typography>
              <Typography variant="caption" sx={{ color: "#A2A0D5" }}>
                Whisper AI is processing the audio transcription.
              </Typography>
            </Box>
          ) : status === "completed" && lyricsText ? (
            <Box sx={{ whiteSpace: "pre-wrap", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "#FFFFFF" }}>
              {lyricsText.split("\n\n").map((stanza, idx) => (
                <Box key={idx} sx={{ mb: 2.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.02)", borderLeft: "3px solid #01F2EA" }}>
                  {stanza}
                </Box>
              ))}
            </Box>
          ) : (
            /* status === 'failed' or 'none' or missing text */
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ fontWeight: "bold", color: "#CE04F2", fontSize: "1rem", mb: 0.5 }}>
                Lyrics are currently unavailable.
              </Typography>
              <Typography variant="caption" sx={{ color: "#A2A0D5" }}>
                {lyricsData.lyrics_error || "No lyrics have been generated for this track."}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Fade>
  );
}
