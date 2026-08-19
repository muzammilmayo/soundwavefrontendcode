import axios from "axios";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor to include JWT token if present
api.interceptors.request.use(
  (config) => {
    let token = null;
    if (store) {
      token = store.getState().auth?.token;
    }
    if (!token) {
      token = localStorage.getItem("auth_token");
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;