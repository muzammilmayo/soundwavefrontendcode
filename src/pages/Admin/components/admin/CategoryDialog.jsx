import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, IconButton, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function CategoryDialog({
  open,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  categoryError,
  editingCategory
}) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(162, 160, 213, 0.2)", minWidth: 400 } }}>
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", borderBottom: "1px solid rgba(162, 160, 213, 0.15)", color: "#FFFFFF" }}>
          {editingCategory ? "Edit Category Details" : "Create New Category"}
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {categoryError && <Alert severity="error" sx={{ borderRadius: 2 }}>{categoryError}</Alert>}
          <TextField
            required
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
                "&:hover fieldset": { borderColor: "#01F2EA" },
                "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                "& fieldset": { borderColor: "rgba(162, 160, 213, 0.2)" },
                "&:hover fieldset": { borderColor: "#01F2EA" },
                "&.Mui-focused fieldset": { borderColor: "#01F2EA" },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#01F2EA" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(162, 160, 213, 0.15)" }}>
          <Button onClick={onClose} sx={{ textTransform: "none", fontWeight: "bold", color: "text.secondary" }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", "&:hover": { bgcolor: "#00DDD5" } }}>
            {editingCategory ? "Save Changes" : "Create Category"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
