const Student = require('../models/Student');

/**
 * Generates a unique admission number for a new student
 * Format: SCHOOL_PREFIX/YEAR/SEQUENTIAL_NUMBER
 * Example: KSS/2024/001
 */
exports.generateAdmissionNumber = async (schoolId) => {
    try {
        // Get current year
        const year = new Date().getFullYear();
        
        // Get school prefix (first 3 letters of school name)
        const school = await require('../models/School').findById(schoolId);
        const prefix = school.name.substring(0, 3).toUpperCase();
        
        // Get last admission number for this school and year
        const lastStudent = await Student.findOne({ 
            school: schoolId,
            admissionNumber: new RegExp(`^${prefix}/${year}/`)
        }).sort({ admissionNumber: -1 });
        
        let sequentialNumber = 1;
        if (lastStudent) {
            const lastNumber = parseInt(lastStudent.admissionNumber.split('/').pop());
            sequentialNumber = lastNumber + 1;
        }
        
        // Format sequential number to 3 digits
        const formattedNumber = String(sequentialNumber).padStart(3, '0');
        
        return `${prefix}/${year}/${formattedNumber}`;
    } catch (error) {
        console.error('Error generating admission number:', error);
        throw error;
    }
};
