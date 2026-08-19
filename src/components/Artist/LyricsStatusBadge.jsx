// src/components/Artist/LyricsStatusBadge.jsx
// Displays the lyrics generation status for a single song in the Artist Dashboard.
// Shows animated "Generating..." when pending/processing, green "Ready" with action
// buttons when completed, or a red "Failed" state with a Retry button.

import { Chip, Box, Button, CircularProgress } from "@mui/material";
import { 
  AutoAwesome as AutoAwesomeIcon,
  EditNote as EditNoteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  LibraryMusic as LyricsIcon
} from "@mui/icons-material";

/**
 * @param {object}   song            - The song object from the API
 * @param {Function} onView          - Called when "View Lyrics" is clicked
 * @param {Function} onEdit          - Called when "Edit Lyrics" is clicked
 * @param {Function} onRegenerate    - Called when "Regenerate" or "Retry" is clicked
 */
export default function LyricsStatusBadge({ song, onView, onEdit, onRegenerate }) {
  const status = song?.lyrics_status || "none";

  if (status === "none") {
    // Song was uploaded before the lyrics feature — show a manual trigger option
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={(e) => e.stopPropagation()}>
        <Chip
          label="No Lyrics"
          size="small"
          icon={<LyricsIcon sx={{ fontSize: "0.85rem !important" }} />}
          sx={{ bgcolor: "rgba(162,160,213,0.1)", color: "#A2A0D5", fontWeight: "bold", fontSize: "0.7rem" }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={onRegenerate}
          startIcon={<AutoAwesomeIcon sx={{ fontSize: "0.8rem !important" }} />}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.68rem", py: 0.2, color: "#01F2EA", borderColor: "rgba(1,242,234,0.4)", "&:hover": { bgcolor: "rgba(1,242,234,0.08)", borderColor: "#01F2EA" } }}
        >
          Generate
        </Button>
      </Box>
    );
  }

  if (status === "pending" || status === "processing") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={(e) => e.stopPropagation()}>
        <Chip
          size="small"
          icon={<CircularProgress size={10} sx={{ color: "#01F2EA !important" }} />}
          label={status === "processing" ? "Transcribing..." : "Generating..."}
          sx={{
            bgcolor: "rgba(1,242,234,0.1)",
            color: "#01F2EA",
            fontWeight: "bold",
            fontSize: "0.7rem",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.6 },
            },
          }}
        />
      </Box>
    );
  }

  if (status === "completed") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
        <Chip
          label="Lyrics Ready"
          size="small"
          sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: "bold", fontSize: "0.7rem" }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={onView}
          startIcon={<LyricsIcon sx={{ fontSize: "0.8rem !important" }} />}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.68rem", py: 0.15, color: "#01F2EA", borderColor: "rgba(1,242,234,0.35)", "&:hover": { bgcolor: "rgba(1,242,234,0.08)" } }}
        >
          View
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onEdit}
          startIcon={<EditNoteIcon sx={{ fontSize: "0.8rem !important" }} />}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.68rem", py: 0.15, color: "#CE04F2", borderColor: "rgba(206,4,242,0.35)", "&:hover": { bgcolor: "rgba(206,4,242,0.08)" } }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={onRegenerate}
          startIcon={<RefreshIcon sx={{ fontSize: "0.8rem !important" }} />}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.65rem", py: 0.15, color: "#A2A0D5", "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.05)" } }}
        >
          Redo
        </Button>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={(e) => e.stopPropagation()}>
        <Chip
          label="Failed"
          size="small"
          icon={<WarningIcon sx={{ fontSize: "0.85rem !important" }} />}
          sx={{ bgcolor: "rgba(239,68,68,0.15)", color: "#EF4444", fontWeight: "bold", fontSize: "0.7rem" }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={onRegenerate}
          startIcon={<RefreshIcon sx={{ fontSize: "0.8rem !important" }} />}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.68rem", py: 0.2, color: "#EF4444", borderColor: "rgba(239,68,68,0.4)", "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return null;
}
