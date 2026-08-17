import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Chip, IconButton, Divider, Tabs, Tab, Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { MusicNote as MusicNoteIcon, Album as AlbumIcon, Comment as CommentIcon, Delete as DeleteIcon, Edit as EditIcon, PlayArrow as PlayArrowIcon, Favorite as FavoriteIcon, Star as StarRateIcon, BarChart as BarChartIcon, People as PeopleIcon, Search as SearchIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import api from "../../api";
import ArtistReportsPanel from "./ArtistReportsPanel";
import PlatformReportsPanel from "./PlatformReportsPanel";

export default function ArtistContentTabs({ 
  user,
  contentTab, 
  setContentTab, 
  artistLoading, 
  songs, 
  albums, 
  feedbacks, 
  handleSelectSong, 
  handleDeleteSong, 
  handleDeleteAlbum, 
  handleOpenEditAlbum, 
  setSelectedAlbum,
  analytics,
  analyticsLoading,
  fetchArtistSongs,
  fetchArtistAlbums,
  showToast,
  deletedSongs = [],
  deletedAlbums = [],
  fetchDeletedItems
}) {

  const handleUpdateSongStatus = async (songId, newStatus) => {
    try {
      await api.put(`/catalog/songs/${songId}`, { status: newStatus });
      showToast(`Song status updated to ${newStatus}.`, "success");
      if (fetchArtistSongs) fetchArtistSongs();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update song status", "error");
    }
  };

  return (
    <>
      <Tabs
        value={contentTab > 4 ? false : contentTab}
        onChange={(e, val) => setContentTab(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 4, borderBottom: "1px solid rgba(162,160,213,0.15)", "& .MuiTabs-indicator": { bgcolor: "#01F2EA" }, "& .MuiTab-root": { fontWeight: "bold", textTransform: "none", fontSize: "1rem", color: "#A2A0D5", "&.Mui-selected": { color: "#01F2EA" } } }}
      >
        <Tab label="Published Songs" icon={<MusicNoteIcon />} iconPosition="start" />
        <Tab label="My Albums" icon={<AlbumIcon />} iconPosition="start" />
        <Tab label="Fan Feedback" icon={<CommentIcon />} iconPosition="start" />
        <Tab label="Insights & Analytics" icon={<BarChartIcon />} iconPosition="start" />
        <Tab label="Trash / Bin" icon={<DeleteIcon />} iconPosition="start" />
      </Tabs>

      {/* Content Panels Workspace */}
      {contentTab === 0 && (
        <Box>
          {artistLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
          ) : (!songs || songs.length === 0) ? (
            <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", p: 4, textAlign: "center", bgcolor: "background.paper" }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                You haven't uploaded any songs yet. Get started by clicking "Upload Song"!
              </Typography>
            </Card>
          ) : (
            <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
              {(songs || []).map((song, idx) => (
                <Box
                  key={song.song_id}
                  onClick={() => handleSelectSong(song)} sx={{ display: "flex", alignItems: "center", px: 3, py: 2.5, borderBottom: idx < songs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none", "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }, transition: "all 0.15s", cursor: "pointer" }}
                >
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                    {song.cover_image ? (
                      <Box component="img" src={song.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 22 }} />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: "600", color: "#FFFFFF" }}>{song.title}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {song.description || "No description"}
                    </Typography>
                  </Box>
                  
                  {/* Neon Color Coded Status Chips */}
                  {song.status === "published" ? (
                    <Chip label="Published" size="small" sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: "bold", mr: 2 }} />
                  ) : song.status === "archived" ? (
                    <Chip label="Archived" size="small" sx={{ bgcolor: "rgba(245,158,11,0.15)", color: "#F59E0B", fontWeight: "bold", mr: 2 }} />
                  ) : song.status === "moderated" ? (
                    <Chip label="Moderated" size="small" sx={{ bgcolor: "rgba(239,68,68,0.15)", color: "#EF4444", fontWeight: "bold", mr: 2 }} />
                  ) : song.status === "scheduled" ? (
                    <Chip label={`Scheduled (${song.scheduled_for ? new Date(song.scheduled_for).toLocaleDateString() : 'N/A'})`} size="small" sx={{ bgcolor: "rgba(124,58,237,0.15)", color: "#8B5CF6", fontWeight: "bold", mr: 2 }} />
                  ) : song.status === "pending_review" ? (
                    <Chip label="Pending Review" size="small" sx={{ bgcolor: "rgba(59,130,246,0.15)", color: "#3B82F6", fontWeight: "bold", mr: 2 }} />
                  ) : (
                    <Chip label="Draft" size="small" sx={{ bgcolor: "rgba(162,160,213,0.15)", color: "text.secondary", fontWeight: "bold", mr: 2 }} />
                  )}

                  {/* Status Lifecycle Controls */}
                  {song.status !== "moderated" && (
                    <Box sx={{ display: "flex", gap: 1, mr: 2 }} onClick={(e) => e.stopPropagation()}>
                      {song.status === "draft" && (
                        <>
                          <Button size="small" variant="outlined" color="primary" onClick={() => handleUpdateSongStatus(song.song_id, "published")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                            Publish
                          </Button>
                          <Button size="small" variant="outlined" color="info" onClick={() => handleUpdateSongStatus(song.song_id, "pending_review")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                            Submit Review
                          </Button>
                          <Button size="small" variant="outlined" color="secondary" onClick={async () => {
                            const date = prompt("Enter scheduled date and time (YYYY-MM-DD HH:mm):", "");
                            if (date) {
                              try {
                                await api.put(`/catalog/songs/${song.song_id}`, { status: "scheduled", scheduled_for: date });
                                showToast("Song scheduled successfully!", "success");
                                if (fetchArtistSongs) fetchArtistSongs();
                              } catch (err) {
                                showToast(err.response?.data?.message || "Failed to schedule", "error");
                              }
                            }
                          }} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                            Schedule
                          </Button>
                        </>
                      )}
                      {song.status === "pending_review" && (
                        <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateSongStatus(song.song_id, "draft")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                          Cancel Review
                        </Button>
                      )}
                      {song.status === "scheduled" && (
                        <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateSongStatus(song.song_id, "draft")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                          Cancel Schedule
                        </Button>
                      )}
                      {song.status === "published" && (
                        <Button size="small" variant="outlined" color="warning" onClick={() => handleUpdateSongStatus(song.song_id, "archived")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                          Archive
                        </Button>
                      )}
                      {song.status === "archived" && (
                        <Button size="small" variant="outlined" color="success" onClick={() => handleUpdateSongStatus(song.song_id, "published")} sx={{ textTransform: "none", borderRadius: 2, fontSize: "0.72rem", py: 0.2 }}>
                          Restore
                        </Button>
                      )}
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2, color: "#01F2EA" }}>
                    <PlayArrowIcon sx={{ fontSize: "1.1rem" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      {song.play_count || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2, color: "#FF2E93" }}>
                    <FavoriteIcon sx={{ fontSize: "1.1rem" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      {song.SongLikes?.length || 0}
                    </Typography>
                  </Box>
                  <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDeleteSong(song.song_id); }} sx={{ ml: 2, "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {contentTab === 1 && (
        <Box>
          {artistLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
          ) : (!albums || albums.length === 0) ? (
            <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", p: 4, textAlign: "center", bgcolor: "background.paper" }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                You haven't created any albums yet. Get started by clicking "Create Album"!
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {(albums || []).map((album) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={album.album_id}>
                  <Card 
                    onClick={() => setSelectedAlbum(album)} 
                    sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", maxWidth: 190, bgcolor: "background.paper", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", borderColor: "#01F2EA", boxShadow: "0 0 15px rgba(1,242,234,0.2)" }, transition: "all 0.2s" }}
                  >
                    <Box sx={{ aspectRatio: "1/1", width: "100%", bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(162,160,213,0.1)", position: "relative", overflow: "hidden" }}>
                      {album.cover_image ? (
                        <Box component="img" src={album.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <AlbumIcon sx={{ color: "#01F2EA", fontSize: 44 }} />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{album.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, height: 32, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.2 }}>{album.description || "No description provided."}</Typography>
                      </Box>
                      <Box>
                        <Divider sx={{ my: 1, borderColor: "rgba(162,160,213,0.1)" }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                            Rel: <strong style={{ color: "#FFFFFF" }}>{album.release_date ? new Date(album.release_date).toLocaleDateString(undefined, {month: 'numeric', year: '2-digit'}) : "N/A"}</strong>
                          </Typography>
                          <Box sx={{ display: "flex" }}>
                            <IconButton color="primary" size="small" onClick={(e) => { e.stopPropagation(); handleOpenEditAlbum(album); }} sx={{ p: 0.5 }}>
                              <EditIcon sx={{ fontSize: "0.95rem" }} />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.album_id); }} sx={{ p: 0.5 }}>
                              <DeleteIcon sx={{ fontSize: "0.95rem" }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {contentTab === 2 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>Fan Reviews & Ratings</Typography>
          {(() => {
            const parsed = feedbacks || [];
            const artistSongIds = songs.map(s => Number(s.song_id));
            const filtered = parsed.filter(f => artistSongIds.includes(Number(f.song_id)));

            if (filtered.length === 0) {
              return (
                <Card sx={{ p: 5, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Typography sx={{ color: "text.secondary" }}>No reviews or feedback received from listeners yet.</Typography>
                </Card>
              );
            }

            return (
              <Grid container spacing={3}>
                {filtered.map((f) => {
                  const matchedSong = songs.find(s => Number(s.song_id) === Number(f.song_id));
                  return (
                    <Grid item xs={12} md={6} key={f.id}>
                      <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pb: 2, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {matchedSong?.cover_image ? <Box component="img" src={matchedSong.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MusicNoteIcon sx={{ color: "#01F2EA" }} />}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.song_title || matchedSong?.title}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>Track Review</Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                            <Box sx={{ display: "flex", color: "#FBBF24" }}>
                              {[...Array(5)].map((_, i) => (
                                <StarRateIcon key={i} sx={{ fontSize: "1.1rem", color: i < (f.rating || 0) ? "#FBBF24" : "rgba(255,255,255,0.1)" }} />
                              ))}
                            </Box>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              by {f.username || "Anonymous Listener"}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>
                            "{f.comment}"
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })()}
        </Box>
      )}

      {contentTab === 3 && (
        <Box>
          {analyticsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
          ) : !analytics ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
              <Typography sx={{ color: "text.secondary" }}>Analytics data could not be retrieved.</Typography>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Grid container spacing={3}>
                {/* Popular songs list */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>🔥 Your Most Popular Tracks</Typography>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", p: 2 }}>
                    {analytics.topSongs.length === 0 ? (
                      <Typography sx={{ color: "text.secondary", p: 2 }}>No tracks played yet.</Typography>
                    ) : (
                      analytics.topSongs.map((song, i) => (
                        <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", py: 1.5, px: 2, borderBottom: i < analytics.topSongs.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none" }}>
                          <Typography sx={{ color: "text.secondary", width: 24 }}>{i + 1}</Typography>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{song.title}</Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>Status: {song.status}</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: "bold", color: "#CE04F2" }}>{song.play_count} plays</Typography>
                        </Box>
                      ))
                    )}
                  </Card>
                </Grid>

                {/* Recent Activity Streams */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>⚡ Real-time Activity Stream</Typography>
                  <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", p: 2 }}>
                    {analytics.recentActivity.length === 0 ? (
                      <Typography sx={{ color: "text.secondary", p: 2 }}>No recent play or like activity recorded.</Typography>
                    ) : (
                      analytics.recentActivity.map((activity, i) => (
                        <Box key={activity.log_id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, px: 2, borderBottom: i < analytics.recentActivity.length - 1 ? "1px solid rgba(162,160,213,0.1)" : "none" }}>
                          <Typography sx={{ color: "#FFFFFF", fontSize: "0.9rem" }}>{activity.description}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>{new Date(activity.created_at).toLocaleTimeString()}</Typography>
                        </Box>
                      ))
                    )}
                  </Card>
                </Grid>
              </Grid>

              {/* Review Distribution Rating Breakdown */}
              <Card sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>⭐ Reviews Breakdown</Typography>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h2" sx={{ fontWeight: "bold", color: "#FBBF24" }}>{analytics.reviews.average}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarRateIcon key={i} sx={{ color: i < Math.round(analytics.reviews.average) ? "#FBBF24" : "rgba(255,255,255,0.1)" }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Average Rating ({analytics.reviews.total} Reviews)</Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {analytics.reviews.distribution.map((count, i) => {
                      const starNum = i + 1;
                      const percent = analytics.reviews.total > 0 ? (count / analytics.reviews.total) * 100 : 0;
                      return (
                        <Box key={starNum} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" sx={{ width: 60, color: "text.secondary" }}>{starNum} Star</Typography>
                          <Box sx={{ flexGrow: 1, height: 8, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", mx: 2 }}>
                            <Box sx={{ height: "100%", width: `${percent}%`, bgcolor: "#FBBF24", borderRadius: 4 }} />
                          </Box>
                          <Typography variant="body2" sx={{ width: 30, textAlign: "right", color: "text.secondary" }}>{count}</Typography>
                        </Box>
                      );
                    }).reverse()}
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {contentTab === 4 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFFFFF" }}>
            Trash / Recently Deleted Catalog Items
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Here you can restore soft-deleted songs and albums back to your active catalog.
          </Typography>

          <Grid container spacing={4}>
            {/* Deleted Songs list */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>
                Deleted Songs
              </Typography>
              {!deletedSongs || deletedSongs.length === 0 ? (
                <Card sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Typography sx={{ color: "text.secondary" }}>No deleted songs found.</Typography>
                </Card>
              ) : (
                <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                  {deletedSongs.map((song) => (
                    <Box key={song.song_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{song.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Deleted on {song.deleted_at ? new Date(song.deleted_at).toLocaleString() : "N/A"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={async () => {
                          try {
                            await api.post(`/catalog/songs/${song.song_id}/restore`);
                            showToast(`"${song.title}" restored successfully!`, "success");
                            if (fetchDeletedItems) fetchDeletedItems();
                            if (fetchArtistSongs) fetchArtistSongs();
                          } catch (err) {
                            showToast(err.response?.data?.message || "Failed to restore", "error");
                          }
                        }}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                      >
                        Restore
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Deleted Albums list */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#FFFFFF" }}>
                Deleted Albums
              </Typography>
              {!deletedAlbums || deletedAlbums.length === 0 ? (
                <Card sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper" }}>
                  <Typography sx={{ color: "text.secondary" }}>No deleted albums found.</Typography>
                </Card>
              ) : (
                <Box sx={{ bgcolor: "background.paper", borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", overflow: "hidden" }}>
                  {deletedAlbums.map((album) => (
                    <Box key={album.album_id} sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: "bold", color: "#FFFFFF" }}>{album.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Deleted on {album.deleted_at ? new Date(album.deleted_at).toLocaleString() : "N/A"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={async () => {
                          try {
                            await api.post(`/catalog/albums/${album.album_id}/restore`);
                            showToast(`"${album.title}" restored successfully!`, "success");
                            if (fetchDeletedItems) fetchDeletedItems();
                            if (fetchArtistAlbums) fetchArtistAlbums();
                          } catch (err) {
                            showToast(err.response?.data?.message || "Failed to restore", "error");
                          }
                        }}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                      >
                        Restore
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Team Management Panel Workspace */}
      {contentTab === 5 && user?.role === "Artist" && (
        <TeamManagementPanel showToast={showToast} />
      )}

      {/* Content Reports Panel Workspace */}
      {contentTab === 6 && (
        <ArtistReportsPanel showToast={showToast} />
      )}

      {/* Platform Reports Panel Workspace */}
      {contentTab === 7 && (
        <PlatformReportsPanel showToast={showToast} />
      )}
    </>
  );
}

function TeamManagementPanel({ showToast }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModerators = async () => {
    try {
      const res = await api.get("/artist/moderators");
      if (res.data.success) {
        setModerators(res.data.moderators);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get(`/artist/search-listeners?q=${encodeURIComponent(val)}`);
      if (res.data.success) {
        setSearchResults(res.data.listeners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAssign = async (email) => {
    try {
      const res = await api.post("/artist/moderators", { email });
      if (res.data.success) {
        showToast("Moderator assigned successfully!", "success");
        setSearchQuery("");
        setSearchResults([]);
        fetchModerators();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to assign moderator", "error");
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await api.delete(`/artist/moderators/${id}`);
      if (res.data.success) {
        showToast("Moderator removed successfully!", "success");
        fetchModerators();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove moderator", "error");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={4}>
        {/* Search & Assign Column */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 2 }}>
            Add Moderator
          </Typography>
          <Card sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", boxShadow: "none" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#A2A0D5" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                  bgcolor: "rgba(0,0,0,0.2)",
                  "& fieldset": { borderColor: "rgba(162,160,213,0.3)" },
                  "&:hover fieldset": { borderColor: "#01F2EA" },
                  "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
                },
              }}
            />

            {searchLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>
            ) : searchResults.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {searchResults.map((user) => (
                  <Box
                    key={user.user_id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(162,160,213,0.1)",
                    }}
                  >
                    <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", mr: 1 }}>
                      <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", fontSize: "0.95rem" }}>
                        {user.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleAssign(user.email)}
                      sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold", flexShrink: 0 }}
                    >
                      Assign
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : searchQuery.trim() ? (
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
                No active listener users found.
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
                Type to search for active listener users to assign as moderators.
              </Typography>
            )}
          </Card>
        </Grid>

        {/* List of moderators Column */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 2 }}>
            Artist Team
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
          ) : moderators.length === 0 ? (
            <Card sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", textAlign: "center" }}>
              <Typography sx={{ color: "text.secondary" }}>
                No moderators assigned yet. Assign a moderator to help manage your catalog!
              </Typography>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162,160,213,0.15)", bgcolor: "background.paper", overflow: "hidden", boxShadow: "none" }}>
              <Table>
                <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#01F2EA", fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.15)" }}>Name</TableCell>
                    <TableCell sx={{ color: "#01F2EA", fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.15)" }}>Email</TableCell>
                    <TableCell sx={{ color: "#01F2EA", fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.15)" }}>Role</TableCell>
                    <TableCell sx={{ color: "#01F2EA", fontWeight: "bold", borderBottom: "1px solid rgba(162,160,213,0.15)" }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {moderators.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.01)" } }}>
                      <TableCell sx={{ color: "#FFFFFF", borderBottom: "1px solid rgba(162,160,213,0.1)" }}>{row.username}</TableCell>
                      <TableCell sx={{ color: "#A2A0D5", borderBottom: "1px solid rgba(162,160,213,0.1)" }}>{row.email}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                        <Chip label="Moderator" size="small" sx={{ bgcolor: "rgba(1, 242, 234, 0.1)", color: "#01F2EA", fontWeight: "bold" }} />
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemove(row.id)}
                          sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold" }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
