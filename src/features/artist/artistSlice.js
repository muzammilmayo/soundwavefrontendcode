import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import artistService from "../../services/artistService";

// Async thunks for Artist Actions
export const fetchArtistProfile = createAsyncThunk(
  "artist/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await artistService.getProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateArtistProfile = createAsyncThunk(
  "artist/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await artistService.updateProfile(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

export const fetchArtistSongs = createAsyncThunk(
  "artist/fetchSongs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await artistService.getSongs();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch songs");
    }
  }
);

export const fetchArtistAlbums = createAsyncThunk(
  "artist/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const data = await artistService.getAlbums();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch albums");
    }
  }
);

export const uploadArtistSong = createAsyncThunk(
  "artist/uploadSong",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await artistService.uploadSong(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload song");
    }
  }
);

export const updateArtistSong = createAsyncThunk(
  "artist/updateSong",
  async ({ id, data: songData }, { rejectWithValue }) => {
    try {
      const data = await artistService.editSong(id, songData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update song");
    }
  }
);

const initialState = {
  profile: null,
  songs: [],
  albums: [],
  loading: false,
  error: null,
};

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    clearArtistState: (state) => {
      state.profile = null;
      state.songs = [];
      state.albums = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtistProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Songs
      .addCase(fetchArtistSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload.data;
      })
      .addCase(fetchArtistSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Albums
      .addCase(fetchArtistAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.data;
      })
      .addCase(fetchArtistAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Song
      .addCase(uploadArtistSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadArtistSong.fulfilled, (state, action) => {
        state.loading = false;
        state.songs.push(action.payload.data);
      })
      .addCase(uploadArtistSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Song
      .addCase(updateArtistSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtistSong.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.songs.findIndex((s) => s.song_id === action.payload.data.song_id);
        if (index !== -1) {
          state.songs[index] = action.payload.data;
        }
      })
      .addCase(updateArtistSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearArtistState } = artistSlice.actions;
export default artistSlice.reducer;
