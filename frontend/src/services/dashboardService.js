import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Add auth token to requests if needed
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;  // Ensure credentials are sent with every request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const dashboardService = {
  // Statistics for SuperAdmin dashboard
  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/superadmin/overview`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Recent activities
  getRecentActivities: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/activities/recent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Detailed statistics
  getUserStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats/users`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  getSchoolStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats/schools`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching school stats:', error);
      throw error;
    }
  },

  getApplicationStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats/applications`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },

  // User Management
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/dashboard/users/${userId}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.patch(`${API_URL}/dashboard/users/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await axios.delete(`${API_URL}/dashboard/users/${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  uploadAvatar: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // User Activity Logging
  getUserActivities: async (userId = null) => {
    try {
      const url = userId 
        ? `${API_URL}/dashboard/activities?userId=${userId}`
        : `${API_URL}/dashboard/activities`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  logUserActivity: async (userId, activity) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users/${userId}/activities`, activity);
      return response.data.data;
    } catch (error) {
      console.error('Error logging user activity:', error);
      throw error;
    }
  },

  // User Roles and Permissions
  getUserRoles: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users/roles`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  createRole: async (roleName) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users/roles`, { name: roleName });
      return response.data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  updateUserRole: async (userId, roleId) => {
    try {
      const response = await axios.put(`${API_URL}/dashboard/users/${userId}/role`, { roleId });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  getRolePermissions: async (roleId) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users/roles/${roleId}/permissions`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      throw error;
    }
  },

  updateRolePermissions: async (roleId, permissions) => {
    try {
      const response = await axios.put(`${API_URL}/dashboard/users/roles/${roleId}/permissions`, { permissions });
      return response.data.data;
    } catch (error) {
      console.error('Error updating role permissions:', error);
      throw error;
    }
  },

  // User Invitation
  inviteUser: async (inviteData) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users/invite`, inviteData);
      return response.data.data;
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }
  },

  resendInvitation: async (inviteId) => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/users/invite/${inviteId}/resend`);
      return response.data.data;
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  },

  // User Profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/dashboard/users/${userId}/profile`, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  updateUserAvatar: async (userId, avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const response = await axios.put(`${API_URL}/dashboard/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw error;
    }
  }
};
