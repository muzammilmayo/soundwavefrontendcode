import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

export default function SongSlider({ songs, currentSong, setCurrentSong, artists, handleArtistClick }) {
  const [carouselHovered, setCarouselHovered] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselHovered || !songs || songs.length === 0) return;
    
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (container) {
        const cardWidth = 156; // 140 width + 16 gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        let newScrollLeft = container.scrollLeft + cardWidth;
        if (newScrollLeft >= maxScroll + 10) {
          newScrollLeft = 0;
        }
        
        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth"
        });
      }
    }, 3000); // Scroll every 3 seconds
    
    return () => clearInterval(interval);
  }, [carouselHovered, songs]);

  if (!songs || songs.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 1 }}>
        Trending Hits <span role="img" aria-label="lightning">⚡</span>
      </Typography>
      <Box 
        ref={carouselRef}
        onMouseEnter={() => setCarouselHovered(true)}
        onMouseLeave={() => setCarouselHovered(false)}
        sx={{ 
          display: "flex", 
          gap: 2, 
          overflowX: "auto", 
          pb: 1.5, 
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-track": { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 10 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(1, 242, 234, 0.2)", borderRadius: 10, "&:hover": { bgcolor: "#01F2EA" } }
        }}
      >
        {songs.slice(0, 10).map((song) => {
          const isCurrent = currentSong?.song_id === song.song_id;
          return (
            <Box 
              key={`slide-${song.song_id}`}
              onClick={() => setCurrentSong(song)}
              sx={{ 
                flex: "0 0 auto", 
                width: 140, 
                bgcolor: "rgba(26, 21, 58, 0.4)", 
                borderRadius: 3, 
                p: 1.5, 
                border: "1px solid", 
                borderColor: isCurrent ? "#01F2EA" : "rgba(162,160,213,0.1)",
                cursor: "pointer", 
                transition: "all 0.2s ease-in-out", 
                "&:hover": { 
                  transform: "translateY(-4px)", 
                  borderColor: "#01F2EA", 
                  boxShadow: "0 4px 16px rgba(1, 242, 234, 0.15)",
                  "& .play-overlay": { opacity: 1 }
                } 
              }}
            >
              <Box sx={{ position: "relative", aspectRatio: "1/1", width: "100%", borderRadius: 2, overflow: "hidden", bgcolor: "rgba(255,255,255,0.02)", mb: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {song.cover_image ? (
                  <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 40 }} />
                )}
                {/* Play overlay button on hover */}
                <Box className="play-overlay" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(16, 11, 41, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease-in-out" }}>
                  <PlayCircleFilledIcon sx={{ color: "#01F2EA", fontSize: 44, filter: "drop-shadow(0 0 8px rgba(1,242,234,0.4))" }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.85rem", mb: 0.5 }}>{song.title}</Typography>
              <Typography 
                variant="caption" 
                onClick={(e) => {
                  e.stopPropagation();
                  const artistObj = artists.find(a => a.artist_profile_id === song.artist_profile_id);
                  if (artistObj) handleArtistClick(artistObj);
                }}
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "0.75rem", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap", 
                  display: "block",
                  cursor: "pointer",
                  "&:hover": { color: "#01F2EA", textDecoration: "underline" } 
                }}
              >
                {song.ArtistProfile?.stage_name || "Unknown Artist"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mt: 0.5 }}>
                {song.play_count || 0} views
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
