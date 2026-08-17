import React from "react";
import { Tabs, Tab } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

export default function NavigationTabs({ activeTab, setActiveTab, setSelectedPlaylist }) {
  return (
    <Tabs
      value={(activeTab === -1 || activeTab === 4 || activeTab === 5) ? false : activeTab}
      onChange={(e, val) => { setSelectedPlaylist(null); setActiveTab(val); }}
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" } }}
    >
      <Tab label="Songs" icon={<MusicNoteIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
      <Tab label="Albums" icon={<AlbumIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
      <Tab label="Artists" icon={<PersonIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
      <Tab label="Playlists" icon={<QueueMusicIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: "bold", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } }} />
    </Tabs>
  );
}
