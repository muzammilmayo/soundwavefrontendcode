import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import api from '../../api';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Logout thunk – clears the cookie on the server
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return {};
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Refresh auth thunk – re-validates the session cookie with the server
export const refreshAuth = createAsyncThunk(
  'auth/refreshAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/profile');
      return response.data; // { user }
    } catch (error) {
      if (error && error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'loading', // Start in loading status until refreshAuth resolves
    error: null,
  },
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──────────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ── Logout ─────────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      })

      // ── Refresh Auth ───────────────────────────────────────────────────────
      .addCase(refreshAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || null; // No dummy session_token to prevent override of httpOnly cookie
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;
