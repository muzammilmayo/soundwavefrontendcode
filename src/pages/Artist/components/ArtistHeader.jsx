import { Box, Typography, Button, Tooltip } from "@mui/material";
import { Add as AddIcon, CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";

export default function ArtistHeader({ profile, setAlbumOpen, setUploadOpen }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 3, borderBottom: "1px solid rgba(162,160,213,0.15)" }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          Artist Dashboard 🎤
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {profile?.stage_name ? `Welcome back, ${profile.stage_name}!` : "Welcome back! Customize your profile settings to get verified."}
          </Typography>
          {profile?.is_verified && (
            <Tooltip title="Verified Artist">
              <CheckCircleIcon sx={{ color: "#01F2EA", fontSize: 16 }} />
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAlbumOpen(true)}
          sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", color: "#CE04F2", borderColor: "#CE04F2", "&:hover": { bgcolor: "rgba(206,4,242,0.05)" } }}
        >
          Create Album
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setUploadOpen(true)}
          sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", boxShadow: "0 4px 14px rgba(1,242,234,0.3)", "&:hover": { bgcolor: "#00DDD5" } }}
        >
          Upload Song
        </Button>
      </Box>
    </Box>
  );
}
