import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import api from '../../api';

// Safe localStorage initialization
const initialToken = localStorage.getItem('auth_token') || null;
let initialUser = null;
try {
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch (e) {
  initialUser = null;
}

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
      return response.data; // { user, token }
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
    user: initialUser,
    token: initialToken,
    status: initialToken ? 'succeeded' : 'idle',
    error: null,
  },
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
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
        if (action.payload.token) {
          localStorage.setItem('auth_token', action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        }
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      })

      // ── Refresh Auth ───────────────────────────────────────────────────────
      .addCase(refreshAuth.pending, (state) => {
        // If we already have user from localStorage, keep status succeeded while refreshing in background
        if (!state.user) {
          state.status = 'loading';
        }
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const refreshedUser = action.payload.user || action.payload;
        state.user = refreshedUser;
        state.token = action.payload.token || state.token || localStorage.getItem('auth_token') || null;
        if (state.token) {
          localStorage.setItem('auth_token', state.token);
        }
        if (refreshedUser) {
          localStorage.setItem('auth_user', JSON.stringify(refreshedUser));
        }
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        // Only invalidate if the server explicitly rejected the token as invalid/unauthorized
        const isAuthError =
          action.payload?.message?.includes('Token') ||
          action.payload?.message?.includes('Unauthorized') ||
          action.payload?.message?.includes('No Token');

        if (isAuthError) {
          state.status = 'failed';
          state.user = null;
          state.token = null;
          state.error = action.payload;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        } else {
          // If transient network glitch, preserve user state so they aren't kicked out
          state.status = 'succeeded';
        }
      });
  },
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;

