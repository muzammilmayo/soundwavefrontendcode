import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService";

// Async thunks for Admin Actions
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin dashboard");
    }
  }
);

export const updateAdminSettings = createAsyncThunk(
  "admin/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const data = await adminService.updateSettings(settings);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update admin settings");
    }
  }
);

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminState: state => {
      state.dashboard = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = { ...state.dashboard, ...action.payload.data };
      })
      .addCase(updateAdminSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
