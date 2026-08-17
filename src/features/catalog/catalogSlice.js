import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import catalogService from "../../services/catalogService";
import api from "../../api";

export const loadListenerState = createAsyncThunk(
  "catalog/loadState",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get("/listener/state");
      return { userId, state: res.data.state };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load state");
    }
  }
);

export const saveListenerState = createAsyncThunk(
  "catalog/saveState",
  async (stateData, { rejectWithValue }) => {
    try {
      const res = await api.post("/listener/state", stateData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save state");
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  "catalog/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/catalog/feedbacks");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch feedbacks");
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "catalog/submitFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const res = await api.post("/catalog/feedbacks", feedbackData);
      return res.data.feedback;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit feedback");
    }
  }
);

export const editFeedbackThunk = createAsyncThunk(
  "catalog/editFeedback",
  async ({ id, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/catalog/feedbacks/${id}`, { rating, comment });
      return res.data.feedback;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update feedback");
    }
  }
);

export const removeFeedbackThunk = createAsyncThunk(
  "catalog/removeFeedback",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/catalog/feedbacks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete feedback");
    }
  }
);

export const toggleLikeFeedbackThunk = createAsyncThunk(
  "catalog/toggleLikeFeedback",
  async ({ feedbackId, userId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/catalog/feedbacks/${feedbackId}/like`);
      return { feedbackId, userId, likes: res.data.likes, likedBy: res.data.likedBy };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle feedback like");
    }
  }
);

export const fetchRecentlyPlayed = createAsyncThunk(
  "catalog/fetchRecentlyPlayed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listener/history");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch recently played");
    }
  }
);

export const recordSongPlay = createAsyncThunk(
  "catalog/recordSongPlay",
  async (songId, { rejectWithValue }) => {
    try {
      const res = await api.post("/listener/history", { songId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to record play history");
    }
  }
);

// Async Thunks for Catalog Browsing
export const fetchPublicArtists = createAsyncThunk(
  "catalog/fetchArtists",
  async (params, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseArtists(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch artists");
    }
  }
);

export const fetchPublicAlbums = createAsyncThunk(
  "catalog/fetchAlbums",
  async (params, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseAlbums(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch albums");
    }
  }
);

export const fetchPublicSongs = createAsyncThunk(
  "catalog/fetchSongs",
  async (params, { rejectWithValue }) => {
    try {
      const data = await catalogService.browseSongs(params);
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
  // --- Redux-Only Library State ---
  playlistsMap: {},        // { [userId]: [] }
  likedSongsMap: {},       // { [userId]: [] }
  savedAlbumsMap: {},      // { [userId]: [] }
  followedArtistsMap: {},  // { [userId]: [] }
  downloadedSongsMap: {},  // { [userId]: [] }
  usersLookup: {},         // { [userId]: { username, email } }
  feedbacks: [],           // [ feedback ]
  recentlyPlayed: [],      // [ play history ]
  // --- Push Notifications Redux State ---
  notificationSettingsMap: {}, // { [userId]: { enabled: true, newSong: true, newAlbum: true } }
  notificationsMap: {}, // user_id -> notifications
  loading: false,
  error: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  }
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setPlaylists(state, action) {
      const { userId, playlists } = action.payload;
      state.playlistsMap[userId] = playlists;
    },
    toggleLikeSong(state, action) {
      const { userId, song } = action.payload;
      if (!state.likedSongsMap[userId]) {
        state.likedSongsMap[userId] = [];
      }
      const list = state.likedSongsMap[userId];
      if (list.some(s => s.song_id === song.song_id)) {
        state.likedSongsMap[userId] = list.filter(s => s.song_id !== song.song_id);
      } else {
        state.likedSongsMap[userId] = [...list, song];
      }
    },
    toggleSaveAlbum(state, action) {
      const { userId, album } = action.payload;
      if (!state.savedAlbumsMap[userId]) {
        state.savedAlbumsMap[userId] = [];
      }
      const list = state.savedAlbumsMap[userId];
      if (list.some(a => a.album_id === album.album_id)) {
        state.savedAlbumsMap[userId] = list.filter(a => a.album_id !== album.album_id);
      } else {
        state.savedAlbumsMap[userId] = [...list, album];
      }
    },
    toggleFollowArtist(state, action) {
      const { userId, artist } = action.payload;
      if (!state.followedArtistsMap[userId]) {
        state.followedArtistsMap[userId] = [];
      }
      const list = state.followedArtistsMap[userId];
      if (list.some(a => a.artist_profile_id === artist.artist_profile_id)) {
        state.followedArtistsMap[userId] = list.filter(a => a.artist_profile_id !== artist.artist_profile_id);
      } else {
        state.followedArtistsMap[userId] = [...list, artist];
      }
    },
    downloadSong(state, action) {
      const { userId, song } = action.payload;
      if (!state.downloadedSongsMap[userId]) {
        state.downloadedSongsMap[userId] = [];
      }
      const list = state.downloadedSongsMap[userId];
      if (!list.some(s => s.song_id === song.song_id)) {
        state.downloadedSongsMap[userId] = [...list, song];
      }
    },
    removeDownloadedSong(state, action) {
      const { userId, songId } = action.payload;
      if (state.downloadedSongsMap[userId]) {
        state.downloadedSongsMap[userId] = state.downloadedSongsMap[userId].filter(s => s.song_id !== songId);
      }
    },
    registerUserLookup(state, action) {
      const { userId, username, email } = action.payload;
      state.usersLookup[userId] = { username, email };
    },
    addFeedback(state, action) {
      state.feedbacks.unshift(action.payload);
    },
    updateFeedback(state, action) {
      state.feedbacks = state.feedbacks.map(f => f.id === action.payload.id ? action.payload : f);
    },
    deleteFeedback(state, action) {
      state.feedbacks = state.feedbacks.filter(f => f.id !== action.payload);
    },
    likeFeedback(state, action) {
      const { feedbackId, userId } = action.payload;
      state.feedbacks = state.feedbacks.map(f => {
        if (f.id === feedbackId) {
          const alreadyLiked = f.likedBy?.includes(userId);
          if (alreadyLiked) {
            return { ...f, likes: (f.likes || 0) - 1, likedBy: (f.likedBy || []).filter(id => id !== userId) };
          } else {
            return { ...f, likes: (f.likes || 0) + 1, likedBy: [...(f.likedBy || []), userId] };
          }
        }
        return f;
      });
    },
    updateNotificationSettings(state, action) {
      const { userId, settings } = action.payload;
      state.notificationSettingsMap[userId] = {
        ...(state.notificationSettingsMap[userId] || { enabled: true, newSong: true, newAlbum: true }),
        ...settings
      };
    },
    addNotification(state, action) {
      const { userId, notification } = action.payload;
      if (!state.notificationsMap[userId]) {
        state.notificationsMap[userId] = [];
      }
      const list = state.notificationsMap[userId];
      if (!list.some(n => n.targetId === notification.targetId && n.type === notification.type)) {
        state.notificationsMap[userId] = [notification, ...list];
      }
    },
    markNotificationsRead(state, action) {
      const { userId } = action.payload;
      if (state.notificationsMap[userId]) {
        state.notificationsMap[userId] = state.notificationsMap[userId].map(n => ({ ...n, read: true }));
      }
    },
    clearNotifications(state, action) {
      const { userId } = action.payload;
      if (state.notificationsMap[userId]) {
        state.notificationsMap[userId] = state.notificationsMap[userId].map(n => ({ ...n, cleared: true }));
      }
    }
  },
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
        state.songs = action.payload.songs || [];
        state.pagination = action.payload.pagination || {
          totalRecords: (action.payload.songs || []).length,
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        };
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
      })
      // Load Listener State
      .addCase(loadListenerState.fulfilled, (state, action) => {
        const { userId, state: stateData } = action.payload;
        if (stateData) {
          state.playlistsMap[userId] = stateData.playlists || [];
          state.likedSongsMap[userId] = stateData.likedSongs || [];
          state.savedAlbumsMap[userId] = stateData.savedAlbums || [];
          state.followedArtistsMap[userId] = stateData.followedArtists || [];
          state.downloadedSongsMap[userId] = stateData.downloadedSongs || [];
          state.notificationsMap[userId] = stateData.notifications || [];
        }
      })
      // Feedbacks Thunks
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload.feedbacks || [];
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.feedbacks.unshift(action.payload);
      })
      .addCase(editFeedbackThunk.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.map(f => f.id === action.payload.id ? action.payload : f);
      })
      .addCase(removeFeedbackThunk.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(f => f.id !== action.payload);
      })
      .addCase(toggleLikeFeedbackThunk.fulfilled, (state, action) => {
        const { feedbackId, likes, likedBy } = action.payload;
        state.feedbacks = state.feedbacks.map(f => {
          if (f.id === feedbackId) {
            return { ...f, likes, likedBy };
          }
          return f;
        });
      })
      .addCase(fetchRecentlyPlayed.fulfilled, (state, action) => {
        state.recentlyPlayed = action.payload.history || [];
      });
  },
});

export const {
  setPlaylists,
  toggleLikeSong,
  toggleSaveAlbum,
  toggleFollowArtist,
  downloadSong,
  removeDownloadedSong,
  registerUserLookup,
  addFeedback,
  updateFeedback,
  deleteFeedback,
  likeFeedback,
  updateNotificationSettings,
  addNotification,
  markNotificationsRead,
  clearNotifications
} = catalogSlice.actions;

export default catalogSlice.reducer;
