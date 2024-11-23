import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_DEV || 'http://localhost:5000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export const authService = {
  googleLogin: async () => {
    try {
      // First, logout any existing session
      await axiosInstance.post('/api/auth/logout');
      // Then redirect to Google OAuth
      window.location.href = `${API_URL}/api/auth/google`;
    } catch (error) {
      console.error('Google login preparation failed:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const { data } = await axiosInstance.post('/api/auth/register', userData);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

 
  login: async (credentials) => {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });
      const { data } = await axiosInstance.post('/api/auth/login', credentials);
      
      console.log('Login response:', data);
      
      if (!data.success) {
        console.error('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      if (!data.user) {
        console.error('Login response missing user data');
        throw new Error('Invalid response from server');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message === 'Already authenticated') {
        console.log('User already authenticated, fetching current user');
        const userData = await authService.getCurrentUser();
        console.log("Returned user:", userData);
        
        if (userData) {
          return { success: true, user: userData };
        }
      }

      // Throw a more descriptive error
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('Final error message:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  getCurrentUser: async () => {
    try {
      // The cookie will be automatically sent with the request due to withCredentials: true
      const { data } = await axiosInstance.get('/api/auth/session');
      console.log('session response:', data)
      // If session exists, return user data
      if (data.success && data.user) {
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Session verification failed:', error);
      return null;
    }
  },

  logout: async () => {
    try {
      // First try to revoke Google access if available
      if (window.gapi?.auth2) {
        const auth2 = window.gapi.auth2.getAuthInstance();
        if (auth2) {
          try {
            await auth2.signOut();
            window.location.href= '/login';
            toast.success('Logged out successfully');
          } catch (error) {
            console.error('Google signout error:', error);
          }
        }
      }

      // Clear any client-side storage
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      // Call backend logout endpoint
      await axiosInstance.post('/api/auth/logout');

      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  }
}