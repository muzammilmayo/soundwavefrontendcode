import api from "../api";

const authService = {
  // Register
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  // Login
  login: async (data) => {
    const res = await api.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot-password", {
      email,
    });
    return res.data;
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    const res = await api.put(`/auth/reset-password/${token}`, {
      newPassword,
    });
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

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Check Login
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  // Get User
  getUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

export default authService;