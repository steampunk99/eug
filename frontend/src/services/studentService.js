import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const studentService = {
    // Get all students for a school with pagination and filters
    getSchoolStudents: async (schoolId, params = {}) => {
        try {
            const response = await axios.get(`${API_URL}/schools/${schoolId}/students`, {
                params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    // Get detailed information about a specific student
    getStudentDetails: async (enrollmentId) => {
        try {
            const response = await axios.get(`${API_URL}/schools/students/${enrollmentId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching student details:', error);
            throw error;
        }
    },

    // Update a student's status
    updateStudentStatus: async (enrollmentId, data) => {
        try {
            const response = await axios.put(
                `${API_URL}/schools/students/${enrollmentId}/status`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating student status:', error);
            throw error;
        }
    },

    // Bulk update student statuses
    bulkUpdateStatus: async (data) => {
        try {
            const response = await axios.post(
                `${API_URL}/schools/students/bulk-status-update`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error performing bulk status update:', error);
            throw error;
        }
    },

    // Get student academic records
    getStudentAcademics: async (enrollmentId) => {
        try {
            const response = await axios.get(
                `${API_URL}/schools/students/${enrollmentId}/academics`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching student academics:', error);
            throw error;
        }
    },

    // Get student attendance records
    getStudentAttendance: async (enrollmentId, params = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/schools/students/${enrollmentId}/attendance`,
                {
                    params,
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching student attendance:', error);
            throw error;
        }
    },

    // Update student profile
    updateStudentProfile: async (enrollmentId, data) => {
        try {
            const response = await axios.put(
                `${API_URL}/schools/students/${enrollmentId}`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating student profile:', error);
            throw error;
        }
    },

    // Add new student
    addStudent: async (schoolId, data) => {
        try {
            const response = await axios.post(
                `${API_URL}/schools/${schoolId}/students`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    },

    // Export student data to Excel
    exportStudentsToExcel: async (schoolId, filters = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/schools/${schoolId}/students/export/excel`,
                {
                    params: filters,
                    withCredentials: true,
                    responseType: 'blob'
                }
            );
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `students_${schoolId}_${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error exporting students:', error);
            throw error;
        }
    },

    // Get all students for a school
    async getStudents(schoolId) {
        try {
            console.log('studentService.getStudents called with schoolId:', schoolId);
            const response = await axios.get(`${API_URL}/enrollments/school/${schoolId}`, {
                withCredentials: true
            });
            console.log('studentService API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in studentService.getStudents:', error);
            throw error;
        }
    },

    // Get single student
    getStudent: async (id) => {
        try {
            const response = await axios.get(
                `${API_URL}/students/${id}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching student:', error);
            throw error;
        }
    },

    // Add new student
    addNewStudent: async (schoolId, data) => {
        try {
            const response = await axios.post(
                `${API_URL}/schools/${schoolId}/students`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    },

    // Update student
    updateStudent: async (id, data) => {
        try {
            const response = await axios.put(
                `${API_URL}/students/${id}`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    },

    // Delete student
    deleteStudent: async (id) => {
        try {
            const response = await axios.delete(
                `${API_URL}/students/${id}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    },

    // Add academic record
    addAcademicRecord: async (studentId, data) => {
        try {
            const response = await axios.post(
                `${API_URL}/students/${studentId}/academic-records`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding academic record:', error);
            throw error;
        }
    },

    // Add fee record
    addFeeRecord: async (studentId, data) => {
        try {
            const response = await axios.post(
                `${API_URL}/students/${studentId}/fee-records`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding fee record:', error);
            throw error;
        }
    },

    // Add disciplinary record
    addDisciplinaryRecord: async (studentId, data) => {
        try {
            const response = await axios.post(
                `${API_URL}/students/${studentId}/disciplinary-records`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding disciplinary record:', error);
            throw error;
        }
    },

    // Update student status
    updateStudentStatusNew: async (schoolId, studentIds, status) => {
        try {
            const response = await axios.put(
                `${API_URL}/schools/${schoolId}/students/bulk-status`,
                { studentIds, status },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating student status:', error);
            throw error;
        }
    }
};

export default studentService;
