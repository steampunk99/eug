import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    const message = error.response.data?.message || 'An error occurred';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/dashboard/users');
      console.log('Staff Users response:',response.data);
      return response.data; // Returns { success: true, data: [...users] }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};