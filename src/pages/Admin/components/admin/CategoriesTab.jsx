import React, { useState } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import CategoryDialog from "./CategoryDialog";
import api from "../../../../api";

export default function CategoriesTab({
  catalogCategories,
  setCatalogCategories,
  fetchCatalogData,
  showToast
}) {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const handleOpenCategoryDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name || "");
      setCategoryDescription(category.description || "");
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
    }
    setCategoryError("");
    setCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryError("");
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      if (editingCategory) {
        const res = await api.put(`/catalog/categories/${editingCategory.category_id}`, {
          name: categoryName.trim(),
          description: categoryDescription.trim()
        });
        showToast("Category updated successfully", "success");
        setCatalogCategories((prev) =>
          prev.map((c) => (c.category_id === editingCategory.category_id ? res.data.category || { ...c, name: categoryName, description: categoryDescription } : c))
        );
      } else {
        const res = await api.post("/catalog/categories", {
          name: categoryName.trim(),
          description: categoryDescription.trim()
        });
        showToast("Category created successfully", "success");
        if (res.data?.category) {
          setCatalogCategories((prev) => [...prev, res.data.category]);
        } else {
          fetchCatalogData();
        }
      }
      handleCloseCategoryDialog();
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to permanently delete this category? All songs in this category will lose their association.")) return;
    try {
      await api.delete(`/catalog/categories/${catId}`);
      showToast("Category deleted successfully", "success");
      setCatalogCategories((prev) => prev.filter((c) => c.category_id !== catId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          Categories & Genres
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenCategoryDialog()}
          sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold", bgcolor: "#01F2EA", color: "#100B29", "&:hover": { bgcolor: "#00DDD5" } }}
        >
          Add New Category
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: "1px solid rgba(162, 160, 213, 0.15)", bgcolor: "background.paper" }}>
        {catalogCategories.length === 0 ? (
          <Typography sx={{ p: 6, color: "text.secondary", textAlign: "center" }}>No categories found in catalog.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {catalogCategories.map((cat) => (
                <TableRow key={cat.category_id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03) !important" } }}>
                  <TableCell sx={{ fontWeight: "600", color: "#01F2EA" }}>{cat.name}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{cat.description || "No description provided."}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button variant="outlined" size="small" onClick={() => handleOpenCategoryDialog(cat)} sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(162,160,213,0.3)", color: "#A2A0D5", "&:hover": { borderColor: "#01F2EA", color: "#01F2EA" } }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteCategory(cat.category_id)} sx={{ textTransform: "none", borderRadius: 2 }}>
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={handleCloseCategoryDialog}
        onSubmit={handleSaveCategory}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryDescription={categoryDescription}
        setCategoryDescription={setCategoryDescription}
        categoryError={categoryError}
        editingCategory={editingCategory}
      />
    </Box>
  );
}
