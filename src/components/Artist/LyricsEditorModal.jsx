// src/components/Artist/LyricsEditorModal.jsx
// Full-featured lyrics viewer and editor modal for the Artist Dashboard.
// The artist can view, manually correct, and save Whisper-generated lyrics,
// or trigger a fresh regeneration.

import { useState, useEffect, useCallback } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, TextField, CircularProgress,
  IconButton, Chip, Alert, Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  LibraryMusic as LyricsIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import artistService from "../../services/artistService";

const STATUS_LABELS = {
  none: { label: "No Lyrics", color: "#A2A0D5", bg: "rgba(162,160,213,0.1)" },
  pending: { label: "Queued...", color: "#01F2EA", bg: "rgba(1,242,234,0.1)" },
  processing: { label: "Transcribing...", color: "#01F2EA", bg: "rgba(1,242,234,0.1)" },
  completed: { label: "Ready", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  failed: { label: "Failed", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};

/**
 * @param {boolean}  open          - Controls dialog visibility
 * @param {Function} onClose       - Called when dialog should close
 * @param {object}   song          - The song object being edited
 * @param {Function} showToast     - Function to show snackbar toast
 * @param {Function} onStatusChange - Called when lyrics_status changes (to refresh parent list)
 */
export default function LyricsEditorModal({ open, onClose, song, showToast, onStatusChange }) {
  const [lyricsText, setLyricsText] = useState("");
  const [lyricsStatus, setLyricsStatus] = useState("none");
  const [lyricsError, setLyricsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pollInterval, setPollInterval] = useState(null);

  // ── Load lyrics when dialog opens / song changes ──────────────────────────
  const loadLyrics = useCallback(async () => {
    if (!song?.song_id) return;
    setLoading(true);
    try {
      const res = await artistService.getLyrics(song.song_id);
      if (res.success) {
        setLyricsText(res.data.lyrics || "");
        setLyricsStatus(res.data.lyrics_status || "none");
        setLyricsError(res.data.lyrics_error || null);
      }
    } catch (err) {
      showToast("Failed to load lyrics", "error");
    } finally {
      setLoading(false);
    }
  }, [song?.song_id, showToast]);

  useEffect(() => {
    if (open && song?.song_id) {
      loadLyrics();
    }
  }, [open, song?.song_id, loadLyrics]);

  // ── Poll while pending/processing ────────────────────────────────────────
  useEffect(() => {
    if (lyricsStatus === "pending" || lyricsStatus === "processing") {
      const id = setInterval(async () => {
        try {
          const res = await artistService.getLyrics(song.song_id);
          if (res.success) {
            const newStatus = res.data.lyrics_status;
            setLyricsStatus(newStatus);
            setLyricsText(res.data.lyrics || "");
            setLyricsError(res.data.lyrics_error || null);
            if (newStatus === "completed" || newStatus === "failed") {
              clearInterval(id);
              if (onStatusChange) onStatusChange(song.song_id, newStatus, res.data.lyrics);
            }
          }
        } catch { /* silent */ }
      }, 4000);
      setPollInterval(id);
      return () => clearInterval(id);
    } else {
      if (pollInterval) { clearInterval(pollInterval); setPollInterval(null); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lyricsStatus]);

  // ── Save edited lyrics ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!song?.song_id) return;
    setSaving(true);
    try {
      await artistService.saveLyrics(song.song_id, lyricsText);
      setLyricsStatus("completed");
      showToast("Lyrics saved successfully!", "success");
      if (onStatusChange) onStatusChange(song.song_id, "completed", lyricsText);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save lyrics", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Regenerate lyrics ────────────────────────────────────────────────────
  const handleRegenerate = async () => {
    if (!song?.song_id) return;
    setRegenerating(true);
    try {
      await artistService.regenerateLyrics(song.song_id);
      setLyricsStatus("pending");
      setLyricsText("");
      setLyricsError(null);
      showToast("Lyrics regeneration queued. This may take a moment...", "success");
      if (onStatusChange) onStatusChange(song.song_id, "pending", "");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to queue regeneration", "error");
    } finally {
      setRegenerating(false);
    }
  };

  // ── Copy to clipboard ────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!lyricsText) return;
    navigator.clipboard.writeText(lyricsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusInfo = STATUS_LABELS[lyricsStatus] || STATUS_LABELS.none;
  const isProcessing = lyricsStatus === "pending" || lyricsStatus === "processing";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: "#1A153A",
            border: "1px solid rgba(162,160,213,0.2)",
            backgroundImage: "none",
          },
        },
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
          borderBottom: "1px solid rgba(162,160,213,0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LyricsIcon sx={{ color: "#01F2EA", fontSize: 22 }} />
          <Box>
            <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", fontSize: "1.05rem", lineHeight: 1.2 }}>
              Song Lyrics
            </Typography>
            <Typography variant="caption" sx={{ color: "#A2A0D5" }}>
              {song?.title || "Untitled"}
            </Typography>
          </Box>
          <Chip
            label={statusInfo.label}
            size="small"
            sx={{
              bgcolor: statusInfo.bg,
              color: statusInfo.color,
              fontWeight: "bold",
              fontSize: "0.7rem",
              ml: 1,
              ...(isProcessing && {
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.55 },
                },
              }),
            }}
            icon={isProcessing ? <CircularProgress size={9} sx={{ color: `${statusInfo.color} !important` }} /> : undefined}
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#01F2EA" }} />
          </Box>
        ) : isProcessing ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#01F2EA", mb: 3 }} />
            <Typography sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 1 }}>
              {lyricsStatus === "processing" ? "Whisper is transcribing the audio..." : "Lyrics generation is queued..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A2A0D5" }}>
              This usually takes 30 seconds to 2 minutes depending on song length.
            </Typography>
          </Box>
        ) : lyricsStatus === "failed" ? (
          <Box sx={{ py: 3 }}>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 3, bgcolor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <Typography sx={{ fontWeight: "bold", mb: 0.5 }}>Lyrics generation failed</Typography>
              {lyricsError && (
                <Typography variant="body2" sx={{ color: "#EF4444", opacity: 0.8 }}>
                  {lyricsError}
                </Typography>
              )}
            </Alert>
            <Typography variant="body2" sx={{ color: "#A2A0D5" }}>
              You can retry the automatic generation, or type/paste the lyrics manually below.
            </Typography>
          </Box>
        ) : null}

        {/* Lyrics text editor — always visible when not in loading/processing state */}
        {!loading && !isProcessing && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#A2A0D5", fontWeight: "bold" }}>
                {lyricsStatus === "completed" ? "Generated lyrics (edit to correct mistakes):" : "Type lyrics manually:"}
              </Typography>
              {lyricsText && (
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  sx={{ color: copied ? "#10B981" : "#A2A0D5", "&:hover": { color: "#FFFFFF" } }}
                  title="Copy lyrics to clipboard"
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={18}
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder={"[Verse 1]\n...\n\n[Chorus]\n...\n\nPaste or type your lyrics here.\nWhisper-generated lyrics may have minor errors — feel free to correct them."}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.02)",
                  borderRadius: 3,
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.88rem",
                  lineHeight: 1.8,
                  "& fieldset": { borderColor: "rgba(162,160,213,0.2)" },
                  "&:hover fieldset": { borderColor: "#01F2EA" },
                  "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
                  color: "#FFFFFF",
                },
              }}
            />
            <Typography variant="caption" sx={{ color: "rgba(162,160,213,0.6)", mt: 1, display: "block" }}>
              💡 Lyrics auto-generated by OpenAI Whisper from your audio file. Transcription may contain minor errors.
            </Typography>
          </>
        )}
      </DialogContent>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <Divider sx={{ borderColor: "rgba(162,160,213,0.15)" }} />
      <DialogActions sx={{ px: 3, py: 2, gap: 1, justifyContent: "space-between" }}>
        <Button
          onClick={handleRegenerate}
          disabled={regenerating || isProcessing}
          startIcon={regenerating ? <CircularProgress size={14} /> : <RefreshIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "#CE04F2",
            borderColor: "rgba(206,4,242,0.4)",
            borderRadius: 3,
            "&:hover": { bgcolor: "rgba(206,4,242,0.08)" },
          }}
          variant="outlined"
        >
          {regenerating ? "Queuing..." : "Re-generate with Whisper"}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}>
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || isProcessing || !lyricsText.trim()}
            variant="contained"
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              bgcolor: "#01F2EA",
              color: "#100B29",
              boxShadow: "0 4px 14px rgba(1,242,234,0.3)",
              "&:hover": { bgcolor: "#00DDD5" },
              "&:disabled": { bgcolor: "rgba(1,242,234,0.2)", color: "rgba(16,11,41,0.5)" },
            }}
          >
            {saving ? "Saving..." : "Save Lyrics"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
