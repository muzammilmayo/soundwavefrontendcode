import React from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

export default function StatCard({ title, value, color, loading }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(162, 160, 213, 0.15)",
        bgcolor: "background.paper",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s",
        "&:hover": { borderColor: color, transform: "translateY(-2px)" },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1.5, color: color }}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );
}
