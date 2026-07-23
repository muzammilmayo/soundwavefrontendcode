import { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Slider } from "@mui/material";
import { 
  SkipPrevious as SkipPreviousIcon, PlayArrow as PlayArrowIcon, Pause as PauseIcon, 
  SkipNext as SkipNextIcon, Shuffle as ShuffleIcon, Repeat as RepeatIcon 
} from "@mui/icons-material";

export default function ArtistPlayerBar({ songs, currentSong, setCurrentSong }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0=off,1=all,2=single
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.song_id === currentSong.song_id);
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    handleSelectSong(songs[prevIdx]);
  };

  const handleNext = () => {
    if (!currentSong) return;
    let nextIdx;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * songs.length);
    } else {
      const idx = songs.findIndex((s) => s.song_id === currentSong.song_id);
      nextIdx = (idx + 1) % songs.length;
    }
    handleSelectSong(songs[nextIdx]);
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    if (audioRef.current) audioRef.current.volume = newValue;
  };

  const handleProgressChange = (e, newValue) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const toggleShuffle = () => setShuffle((prev) => !prev);
  const cycleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

  // Sync audio src & playback when currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `http://localhost:5000/uploads/${currentSong.audio_file}`;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentSong, isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Audio event listeners for time & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [repeatMode, songs, currentSong, shuffle]); // Added shuffle to dependencies

  // Auto-play on select
  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
    }
  }, [currentSong]);


  return (
    <>
      <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, bgcolor: "rgba(20,14,52,0.9)", backdropFilter: "blur(8px)", px: 2, py: 1, display: "flex", alignItems: "center", gap: 2, zIndex: 1000 }}>
        {/* Track Info */}
        {currentSong ? (
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
            <Box component="img" src={currentSong.cover_image || ""} alt="cover" sx={{ width: 40, height: 40, borderRadius: 1, mr: 1, objectFit: "cover" }} />
            <Typography variant="body2" sx={{ color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
              {currentSong.title}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#A2A0D5", minWidth: 200 }}>Select a song</Typography>
        )}
        {/* Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: 2 }}>
          <IconButton onClick={toggleShuffle} sx={{ color: shuffle ? "#01F2EA" : "#A2A0D5" }}>
            <ShuffleIcon />
          </IconButton>
          <IconButton onClick={handlePrev} sx={{ color: "#A2A0D5" }}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={handlePlayPause} sx={{ color: "#01F2EA" }}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={handleNext} sx={{ color: "#A2A0D5" }}>
            <SkipNextIcon />
          </IconButton>
          <IconButton onClick={cycleRepeat} sx={{ color: repeatMode !== 0 ? "#01F2EA" : "#A2A0D5" }}>
            <RepeatIcon />
          </IconButton>
        </Box>
        {/* Progress Slider */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <Slider
            size="small"
            value={currentTime}
            min={0}
            max={duration || 0}
            onChange={handleProgressChange}
            sx={{ color: "#01F2EA" }}
          />
        </Box>
        {/* Time */}
        <Typography variant="caption" sx={{ color: "#A2A0D5", minWidth: 50, textAlign: "right" }}>
          {`${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, "0")}`}
        </Typography>
        {/* Volume */}
        <Box sx={{ width: 100, mx: 1 }}>
          <Slider
            size="small"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            sx={{ color: "#01F2EA" }}
          />
        </Box>
      </Box>
      <audio ref={audioRef} style={{ display: "none" }} />
    </>
  );
}
