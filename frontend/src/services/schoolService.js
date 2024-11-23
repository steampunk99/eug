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

const schoolService = {
  // Get all schools with optional filters
  getSchools: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/schools`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },

  // Get a single school by ID
  getSchoolById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/schools/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school:', error);
      throw error;
    }
  },

  // Create a new school
  createSchool: async (schoolData) => {
    try {
      const response = await axios.post(`${API_URL}/schools`, schoolData);
      return response.data;
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },

  // Update a school
  updateSchool: async (id, schoolData) => {
    try {
      const response = await axios.put(`${API_URL}/schools/${id}`, schoolData);
      return response.data;
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  },

  // Delete a school
  deleteSchool: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schools/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  },

  // Upload school images
  uploadSchoolImages: async (id, formData) => {
    try {
      const response = await axios.post(`${API_URL}/schools/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading school images:', error);
      throw error;
    }
  },

  // Delete school image
  deleteSchoolImage: async (schoolId, imageId) => {
    try {
      const response = await axios.delete(`${API_URL}/schools/${schoolId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting school image:', error);
      throw error;
    }
  },

  // Get school statistics
  getSchoolStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/schools/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school stats:', error);
      throw error;
    }
  },

  // Get school dashboard statistics
  getSchoolDashboardStats: async (schoolId) => {
    try {
      const response = await axios.get(`${API_URL}/schools/${schoolId}/dashboard-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school dashboard stats:', error);
      throw error;
    }
  },

  // Get school applications
  getSchoolApplications: async (schoolId, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/schools/${schoolId}/applications`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching school applications:', error);
      throw error;
    }
  },

  // Get application details
  getApplicationDetails: async (schoolId, applicationId) => {
    try {
      const response = await axios.get(`${API_URL}/schools/${schoolId}/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (schoolId, applicationId, status) => {
    try {
      const response = await axios.put(`${API_URL}/schools/${schoolId}/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Quick search schools by name
  quickSearch: async (query) => {
    try {
      console.log('Quick searching schools with query:', query);
      const response = await axios.get(`${API_URL}/schools/search`, { 
        params: { query }
      });
      return response.data.data; // Return just the schools array
    } catch (error) {
      console.error('Error searching schools:', error);
      throw error;
    }
  },

  // Get school by admin ID
  getSchoolByAdminId: async (adminId) => {
    try {
      const response = await axios.get(`${API_URL}/schools/admin/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school by admin ID:', error);
      throw error;
    }
  },

  // Staff Management Methods
  getSchoolStaff: async (schoolId) => {
    try {
      const response = await axios.get(`${API_URL}/staff/${schoolId}/staff`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school staff:', error);
      throw error;
    }
  },

  addStaffMember: async (schoolId, staffData) => {
    try {
      const response = await axios.post(`${API_URL}/staff/${schoolId}/staff`, staffData);
      return response.data;
    } catch (error) {
      console.error('Error adding staff member:', error);
      throw error;
    }
  },

  updateStaffMember: async (schoolId, staffId, data) => {
    try {
      const response = await axios.put(`${API_URL}/schools/${schoolId}/staff/${staffId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  removeStaffMember: async (schoolId, staffId) => {
    try {
      const response = await axios.delete(`${API_URL}/schools/${schoolId}/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing staff member:', error);
      throw error;
    }
  },

  // Associate user with school
  associateUserWithSchool: async (schoolId, userData) => {
    try {
      const response = await axios.post(`${API_URL}/staff/${schoolId}/associate-user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error associating user with school:', error);
      throw error;
    }
  },

  // Export applications to Excel
  exportApplicationsToExcel: async (schoolId, filters = {}) => {
    try {
      // Create query string from filters
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      // Make request with responseType blob to handle file download
      const response = await axios.get(
        `${API_URL}/schools/${schoolId}/applications/export/excel`,
        {
          params,
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting applications:', error);
      throw error;
    }
  },
};

export { schoolService };
