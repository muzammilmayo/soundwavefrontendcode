import api from '../api'; // Assuming a generic api helper exists

const adminService = {
  getDashboard: async () => {
    // Replace with actual endpoint
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },
};

export default adminService;
