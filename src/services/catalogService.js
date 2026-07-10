import api from "../api";

const catalogService = {
  // ---------------- Public browsing endpoints ----------------
  
  // List all registered artists
  browseArtists: async () => {
    const res = await api.get("/catalog/artists");
    return res.data;
  },

  // List all published albums
  browseAlbums: async () => {
    const res = await api.get("/catalog/albums");
    return res.data;
  },

  // List all published songs
  browseSongs: async () => {
    const res = await api.get("/catalog/songs");
    return res.data;
  },

  // List all categories
  browseCategories: async () => {
    const res = await api.get("/catalog/categories");
    return res.data;
  },

  // ---------------- Admin oversight endpoints ----------------

  // Create an album
  createAlbum: async (data) => {
    const res = await api.post("/catalog/albums", data);
    return res.data;
  },

  // Update an album
  updateAlbum: async (id, data) => {
    const res = await api.put(`/catalog/albums/${id}`, data);
    return res.data;
  },

  // Delete an album
  deleteAlbum: async (id) => {
    const res = await api.delete(`/catalog/albums/${id}`);
    return res.data;
  },

  // Create a song
  createSong: async (data) => {
    const res = await api.post("/catalog/songs", data);
    return res.data;
  },

  // Update a song
  updateSong: async (id, data) => {
    const res = await api.put(`/catalog/songs/${id}`, data);
    return res.data;
  },

  // Delete a song
  deleteSong: async (id) => {
    const res = await api.delete(`/catalog/songs/${id}`);
    return res.data;
  },

  // Create a category
  createCategory: async (data) => {
    const res = await api.post("/catalog/categories", data);
    return res.data;
  },

  // Update a category
  updateCategory: async (id, data) => {
    const res = await api.put(`/catalog/categories/${id}`, data);
    return res.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const res = await api.delete(`/catalog/categories/${id}`);
    return res.data;
  },
};

export default catalogService;
