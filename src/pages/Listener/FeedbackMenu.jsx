import React from "react";
import { Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FeedbackMenu({
  feedbackAnchorEl,
  handleCloseFeedbackMenu,
  selectedFeedbackMenu,
  handleEditFeedback,
  handleDeleteFeedback
}) {
  return (
    <Menu
      anchorEl={feedbackAnchorEl}
      open={Boolean(feedbackAnchorEl)}
      onClose={handleCloseFeedbackMenu}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#1A153A",
            border: "1px solid rgba(162,160,213,0.2)",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
          }
        }
      }}
    >
      <MenuItem 
        onClick={() => selectedFeedbackMenu && handleEditFeedback(selectedFeedbackMenu)}
        sx={{ color: "#FFFFFF", "&:hover": { bgcolor: "rgba(1,242,234,0.1)" }, gap: 1.5, px: 2, py: 1 }}
      >
        <EditIcon sx={{ fontSize: 18, color: "#01F2EA" }} />
        Edit Review
      </MenuItem>
      <MenuItem 
        onClick={() => selectedFeedbackMenu && handleDeleteFeedback(selectedFeedbackMenu.id)}
        sx={{ color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" }, gap: 1.5, px: 2, py: 1 }}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
        Delete Review
      </MenuItem>
    </Menu>
  );
}
