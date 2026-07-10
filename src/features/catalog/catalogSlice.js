import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import catalogService from "../../services/catalogService";

// Async Thunks for Catalog Browsing
export const fetchPublicArtists = createAsyncThunk(
  "catalog/fetchArtists",
  async (_, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseArtists();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch artists");
    }
  }
);

export const fetchPublicAlbums = createAsyncThunk(
  "catalog/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseAlbums();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch albums");
    }
  }
);

export const fetchPublicSongs = createAsyncThunk(
  "catalog/fetchSongs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseSongs();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch songs");
    }
  }
);

export const fetchPublicCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// Admin Thunks
export const createPublicAlbum = createAsyncThunk(
  "catalog/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const data = await catalogService.createAlbum(albumData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create album");
    }
  }
);

export const deletePublicAlbum = createAsyncThunk(
  "catalog/deleteAlbum",
  async (id, { rejectWithValue }) => {
    try {
      await catalogService.deleteAlbum(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete album");
    }
  }
);

export const createPublicCategory = createAsyncThunk(
  "catalog/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await catalogService.createCategory(categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

export const deletePublicCategory = createAsyncThunk(
  "catalog/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await catalogService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

export const deletePublicSong = createAsyncThunk(
  "catalog/deleteSong",
  async (id, { rejectWithValue }) => {
    try {
      await catalogService.deleteSong(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete song");
    }
  }
);

const initialState = {
  artists: [],
  albums: [],
  songs: [],
  categories: [],
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Artists
      .addCase(fetchPublicArtists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload.artists || action.payload.data || [];
      })
      .addCase(fetchPublicArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Albums
      .addCase(fetchPublicAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.albums || action.payload.data || [];
      })
      .addCase(fetchPublicAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Songs
      .addCase(fetchPublicSongs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload.songs || action.payload.data || [];
      })
      .addCase(fetchPublicSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Categories
      .addCase(fetchPublicCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || action.payload.data || [];
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Delete Album
      .addCase(deletePublicAlbum.fulfilled, (state, action) => {
        state.albums = state.albums.filter((a) => a.album_id !== action.payload);
      })
      // Admin Delete Song
      .addCase(deletePublicSong.fulfilled, (state, action) => {
        state.songs = state.songs.filter((s) => s.song_id !== action.payload);
      })
      // Admin Delete Category
      .addCase(deletePublicCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.category_id !== action.payload);
      });
  },
});

export default catalogSlice.reducer;
