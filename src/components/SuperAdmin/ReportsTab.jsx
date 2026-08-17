import React from "react";
import { Box, Card, CardContent, Typography, Grid, Divider, LinearProgress } from "@mui/material";

export default function ReportsTab({
  catalogSongs,
  catalogArtists,
  catalogCategories
}) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
        System Reports & Analysis
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: "Total System Tracks", value: catalogSongs.length, color: "#01F2EA" },
          { title: "Featured Artists", value: catalogArtists.length, color: "#CE04F2" },
          { title: "Music Categories", value: catalogCategories.length, color: "#A2A0D5" },
        ].map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", textAlign: "center" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>{card.title}</Typography>
                <Typography variant="h2" sx={{ fontWeight: "bold", color: card.color }}>{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper", mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Breakdown of Songs by Genre / Category</Typography>
          <Divider sx={{ mb: 3, borderColor: "rgba(162,160,213,0.15)" }} />
          {catalogCategories.map((cat) => {
            const count = catalogSongs.filter(s => s.Category?.name === cat.name).length;
            const percent = catalogSongs.length > 0 ? (count / catalogSongs.length) * 100 : 0;
            return (
              <Box key={cat.category_id} sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>{cat.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{count} tracks ({percent.toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.05)", "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: "#01F2EA" } }} />
              </Box>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
}
