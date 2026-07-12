import api from "../api";

const artistService = {
  // Fetch logged-in artist's profile
  getProfile: async () => {
    const res = await api.get("/artist/profile");
    return res.data;
  },

  // Update artist's profile metadata (stage_name, bio, cover_image, profile_image, socials)
  updateProfile: async (data) => {
    const res = await api.put("/artist/profile", data);
    return res.data;
  },

  // Fetch artist's own songs
  getSongs: async () => {
    const res = await api.get("/artist/songs");
    return res.data;
  },

  // Fetch artist's own albums
  getAlbums: async () => {
    const res = await api.get("/artist/albums");
    return res.data;
  },

  // Fetch artist's aggregated stats
  getStats: async () => {
    const res = await api.get("/artist/stats");
    return res.data;
  },

  // Upload a new song (handles multipart/form-data for audio and cover art files)
  uploadSong: async (formData) => {
    const res = await api.post("/artist/songs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Edit metadata/association of an existing song owned by the artist
  editSong: async (id, data) => {
    const res = await api.put(`/artist/songs/${id}`, data);
    return res.data;
  },
};

export default artistService;
