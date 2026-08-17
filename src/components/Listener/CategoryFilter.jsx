import React from "react";
import { Box, Typography, Chip } from "@mui/material";

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "#FFFFFF" }}>Categories / Genres</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
        <Chip
          label="All Genres"
          clickable
          onClick={() => setSelectedCategory(null)}
          sx={{ 
            fontWeight: "bold", 
            borderRadius: 2, 
            bgcolor: selectedCategory === null ? "#01F2EA" : "rgba(255,255,255,0.05)", 
            color: selectedCategory === null ? "#100B29" : "#FFFFFF", 
            "&:hover": { bgcolor: selectedCategory === null ? "#00DDD5" : "rgba(255,255,255,0.1)" } 
          }}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.category_id}
            label={cat.name}
            clickable
            onClick={() => setSelectedCategory(cat.category_id)}
            sx={{ 
              fontWeight: "bold", 
              borderRadius: 2, 
              bgcolor: selectedCategory === cat.category_id ? "#01F2EA" : "rgba(255,255,255,0.05)", 
              color: selectedCategory === cat.category_id ? "#100B29" : "#FFFFFF", 
              "&:hover": { bgcolor: selectedCategory === cat.category_id ? "#00DDD5" : "rgba(255,255,255,0.1)" } 
            }}
          />
        ))}
      </Box>
    </>
  );
}
