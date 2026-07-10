import api from "../api";
import store from "../store";

const authService = {
  // Register
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  // Login
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot-password", {
      email,
    });
    return res.data;
  },

  // Get current logged in user (via HttpOnly cookie)
  getCurrentUser: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  // Change Password
  changePassword: async (data) => {
    const res = await api.put("/auth/change-password", data);
    return res.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }
    // Clear Redux state
    store.dispatch({ type: "auth/clearAuth" });
  },

  // Check Login
  isLoggedIn: () => {
    return !!store.getState().auth.user;
  },

  // Get User
  getUser: () => {
    return store.getState().auth.user;
  },
};

export default authService;