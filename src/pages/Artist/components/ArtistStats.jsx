import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import { MusicNote as MusicNoteIcon, Album as AlbumIcon, PlayArrow as PlayArrowIcon, Favorite as FavoriteIcon } from "@mui/icons-material";

export default function ArtistStats({ songs, albums }) {
  const stats = [
    { label: "Total Songs", value: songs.length, color: "#01F2EA", icon: <MusicNoteIcon /> },
    { label: "Albums ", value: albums.length, color: "#CE04F2", icon: <AlbumIcon /> },
    { label: "Total Views", value: songs.reduce((acc, s) => acc + (s.play_count || 0), 0), color: "#10B981", icon: <PlayArrowIcon /> },
    { label: "Total Likes ", value: songs.reduce((acc, s) => acc + (s.SongLikes?.length || 0), 0), color: "#FF2E93", icon: <FavoriteIcon /> },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.label}>
          <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <CardContent sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: stat.color, filter: `drop-shadow(0 0 4px ${stat.color}40)` }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)", border: `1px solid ${stat.color}40`, color: stat.color }}>
                {stat.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
