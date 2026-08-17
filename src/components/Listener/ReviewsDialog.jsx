import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton, Rating, TextField, Chip, Avatar, Tooltip, Fade } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";

export default function ReviewsDialog({
  feedbackOpen,
  setFeedbackOpen,
  setEditingFeedback,
  setFeedbackComment,
  setFeedbackRating,
  feedbackSong,
  feedbackStats,
  editingFeedback,
  handleSubmitFeedback,
  feedbackRating,
  feedbackComment,
  inputStyles,
  handleCancelEdit,
  getSortedAndFilteredFeedbacks,
  feedbackFilter,
  setFeedbackFilter,
  currentUser,
  formatRelativeTime,
  handleLikeFeedback,
  handleOpenFeedbackMenu,
  triggerReport
}) {
  return (
    <Dialog 
      open={feedbackOpen} 
      onClose={() => { setFeedbackOpen(false); setEditingFeedback(null); setFeedbackComment(""); setFeedbackRating(5); }} 
      fullWidth 
      maxWidth="md" 
      slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "#1A153A", border: "1px solid rgba(162,160,213,0.2)", maxHeight: "90vh" } } }}
    >
      {/* Dialog Header with Song Info */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          pb: 2,
          background: "linear-gradient(135deg, rgba(1,242,234,0.08) 0%, rgba(206,4,242,0.05) 100%)",
          borderBottom: "1px solid rgba(162,160,213,0.15)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <IconButton 
              onClick={() => { setFeedbackOpen(false); setEditingFeedback(null); setFeedbackComment(""); setFeedbackRating(5); }} 
              sx={{ color: "text.secondary", "&:hover": { color: "#01F2EA" } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography component="span" variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Reviews & Comments
            </Typography>
          </Box>

          {/* Song Info Card */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, ml: 1 }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: 2, 
              overflow: "hidden", 
              border: "1px solid rgba(162,160,213,0.2)",
              flexShrink: 0
            }}>
              {feedbackSong?.cover_image ? (
                <Box component="img" src={feedbackSong.cover_image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.03)" }}>
                  <MusicNoteIcon sx={{ color: "#01F2EA", fontSize: 28 }} />
                </Box>
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", fontSize: "1.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {feedbackSong?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {feedbackSong?.ArtistProfile?.stage_name || "Unknown Artist"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 0, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Rating Stats Dashboard */}
        {feedbackStats.total > 0 && (
          <Box sx={{ 
            py: 3, 
            borderBottom: "1px solid rgba(162,160,213,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}>
            {/* Average Score */}
            <Box sx={{ textAlign: "center", minWidth: 100 }}>
              <Typography variant="h2" sx={{ fontWeight: "bold", color: "#01F2EA", lineHeight: 1 }}>
                {feedbackStats.average}
              </Typography>
              <Rating 
                value={parseFloat(feedbackStats.average)} 
                precision={0.1} 
                readOnly 
                size="small"
                sx={{ 
                  color: "#01F2EA",
                  "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.3)" }
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                {feedbackStats.total} review{feedbackStats.total !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {/* Rating Distribution Bars */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.8 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = feedbackStats.distribution[star - 1] || 0;
                const percentage = feedbackStats.total > 0 ? (count / feedbackStats.total) * 100 : 0;
                return (
                  <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", width: 20, textAlign: "right", fontSize: "0.75rem" }}>
                      {star}
                    </Typography>
                    <StarIcon sx={{ color: "#01F2EA", fontSize: 14 }} />
                    <Box sx={{ flexGrow: 1, height: 6, bgcolor: "rgba(162,160,213,0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <Box sx={{ 
                        width: `${percentage}%`, 
                        height: "100%", 
                        bgcolor: star >= 4 ? "#01F2EA" : star === 3 ? "#A2A0D5" : "#EF4444",
                        borderRadius: 3,
                        transition: "width 0.5s ease"
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", width: 30, fontSize: "0.75rem" }}>
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Write Review Section */}
        <Box sx={{ py: 3, borderBottom: "1px solid rgba(162,160,213,0.1)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 2 }}>
            {editingFeedback ? "Edit Your Review" : "Write a Review"}
          </Typography>
          <Box component="form" onSubmit={handleSubmitFeedback} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Your Rating:</Typography>
              <Rating
                value={feedbackRating}
                onChange={(e, val) => setFeedbackRating(val || 1)}
                size="large"
                sx={{ 
                  color: "#01F2EA",
                  "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.3)" }
                }}
              />
              <Typography variant="body2" sx={{ color: "#01F2EA", fontWeight: "bold", ml: 1 }}>
                {feedbackRating}/5
              </Typography>
            </Box>
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              placeholder="Share your thoughts about this song..."
              value={feedbackComment} 
              onChange={(e) => setFeedbackComment(e.target.value)} 
              required 
              sx={{
                ...inputStyles,
                "& .MuiOutlinedInput-root": {
                  ...inputStyles["& .MuiOutlinedInput-root"],
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: 3
                }
              }}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              {editingFeedback && (
                <Button 
                  onClick={handleCancelEdit} 
                  sx={{ color: "text.secondary", textTransform: "none", fontWeight: "bold" }}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                endIcon={<SendIcon />}
                disabled={!feedbackComment.trim()}
                sx={{ 
                  bgcolor: "#01F2EA", 
                  color: "#100B29", 
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": { bgcolor: "#00DDD5" },
                  "&:disabled": { bgcolor: "rgba(1,242,234,0.3)", color: "rgba(16,11,41,0.5)" }
                }}
              >
                {editingFeedback ? "Update Review" : "Post Review"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Reviews List Header with Sort/Filter */}
        <Box sx={{ 
          py: 2, 
          borderBottom: "1px solid rgba(162,160,213,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
            All Reviews ({getSortedAndFilteredFeedbacks().length})
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button 
              size="small" 
              onClick={() => setFeedbackFilter(feedbackFilter === "all" ? "mine" : "all")}
              sx={{ 
                textTransform: "none", 
                fontWeight: "bold",
                color: feedbackFilter === "mine" ? "#01F2EA" : "text.secondary",
                borderRadius: 2,
                border: feedbackFilter === "mine" ? "1px solid #01F2EA" : "1px solid rgba(162,160,213,0.2)",
                px: 1.5
              }}
            >
              {feedbackFilter === "mine" ? "My Reviews" : "All Reviews"}
            </Button>
          </Box>
        </Box>

        {/* Reviews List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: "50vh", overflowY: "auto", py: 1 }}>
          {getSortedAndFilteredFeedbacks().length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CommentIcon sx={{ color: "rgba(162,160,213,0.2)", fontSize: 48, mb: 2 }} />
              <Typography sx={{ color: "text.secondary" }}>
                {feedbackFilter === "mine" ? "You haven't reviewed this song yet." : "No reviews yet. Be the first to share your thoughts!"}
              </Typography>
            </Box>
          ) : (
            getSortedAndFilteredFeedbacks().map((f) => (
              <Fade key={f.id} in={true} timeout={300}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  bgcolor: "rgba(255,255,255,0.02)", 
                  border: "1px solid rgba(162,160,213,0.08)",
                  mb: 1.5,
                  transition: "all 0.2s",
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(162,160,213,0.15)"
                  }
                }}>
                  {/* Review Header */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: f.user_id === currentUser?.id ? "#01F2EA" : "#CE04F2",
                          color: "#100B29",
                          fontWeight: "bold",
                          fontSize: "0.9rem"
                        }}
                      >
                        {f.username?.charAt(0).toUpperCase() || "?"}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            {f.username}
                          </Typography>
                          {f.user_id === currentUser?.id && (
                            <Chip label="You" size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: "rgba(1,242,234,0.15)", color: "#01F2EA", fontWeight: "bold" }} />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Rating value={f.rating} readOnly size="small" sx={{ color: "#01F2EA", "& .MuiRating-iconEmpty": { color: "rgba(162,160,213,0.2)" } }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {formatRelativeTime(f.timestamp)}
                            {f.edited && <span style={{ fontStyle: "italic", marginLeft: 4 }}>(edited)</span>}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Review Actions Menu */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip title="Like this review">
                        <IconButton 
                          size="small" 
                          onClick={() => handleLikeFeedback(f.id)}
                          sx={{ 
                            color: f.likedBy?.includes(currentUser?.id || "guest") ? "#CE04F2" : "text.secondary",
                            "&:hover": { color: "#CE04F2" }
                          }}
                        >
                          <FavoriteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 16 }}>
                        {f.likes || 0}
                      </Typography>
                      {f.user_id === currentUser?.id ? (
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleOpenFeedbackMenu(e, f)}
                          sx={{ color: "text.secondary", ml: 0.5 }}
                        >
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
                          <Tooltip title="Report Comment">
                            <IconButton 
                              size="small" 
                              onClick={() => { setFeedbackOpen(false); triggerReport("comment", f.id, f.comment.length > 25 ? f.comment.substring(0, 25) + "..." : f.comment); }}
                              sx={{ color: "text.secondary", "&:hover": { color: "#EF4444" } }}
                            >
                              <FlagIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Report Commenter User">
                            <IconButton 
                              size="small" 
                              onClick={() => { setFeedbackOpen(false); triggerReport("user", f.user_id, f.username); }}
                              sx={{ color: "text.secondary", "&:hover": { color: "#EF4444" } }}
                            >
                              <PersonIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Review Content */}
                  <Typography variant="body2" sx={{ color: "#FFFFFF", lineHeight: 1.6, pl: 0.5 }}>
                    {f.comment}
                  </Typography>
                </Box>
              </Fade>
            ))
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
