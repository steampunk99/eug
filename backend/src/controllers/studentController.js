const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');
const Student = require('../models/Student');
const { generateAdmissionNumber } = require('../utils/studentUtils');

// Get school students with pagination and filters
exports.getSchoolStudents = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || 'Active';
        const search = req.query.search || '';

        const query = {
            school: schoolId,
            studentStatus: status
        };

        // Add search functionality
        if (search) {
            const userIds = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            
            query.student = { $in: userIds.map(u => u._id) };
        }

        const total = await Enrollment.countDocuments(query);
        const enrollments = await Enrollment.find(query)
            .populate('student', 'name email phoneNumber avatar')
            .sort({ enrollmentDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            enrollments,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch(error) {
        console.error('Error in getSchoolStudents:', error);
        res.status(500).json({
            message: 'Failed to fetch students',
            error: error.message
        });
    }
};

// Update student status with activity logging
exports.updateStudentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { studentStatus, reason } = req.body;

        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { 
                studentStatus,
                lastStatusUpdate: new Date(),
                statusUpdateReason: reason
            },
            { new: true, runValidators: true }
        ).populate('student', 'name email');

        if (!enrollment) {
            return res.status(404).json({ message: 'Student enrollment not found.' });
        }

        // Log the activity
        await Activity.create({
            user: enrollment.student,
            performedBy: req.user._id,
            action: 'update_status',
            details: `Student status updated to ${studentStatus}`,
            metadata: {
                previousStatus: enrollment.studentStatus,
                newStatus: studentStatus,
                reason: reason
            }
        });

        res.json({
            message: 'Student status updated successfully',
            enrollment
        });
    } catch(error) {
        console.error('Error in updateStudentStatus:', error);
        res.status(500).json({
            message: 'Failed to update student status',
            error: error.message
        });
    }
};

// Get student details
exports.getStudentDetails = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate('student', 'name email phoneNumber avatar')
            .populate('school', 'name type category');
            
        if (!enrollment) {
            return res.status(404).json({ message: 'Student enrollment not found.' });
        }

        // Get student's activity history
        const activities = await Activity.find({
            user: enrollment.student._id
        })
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({
            enrollment,
            activities
        });
    } catch(error) {
        console.error('Error in getStudentDetails:', error);
        res.status(500).json({
            message: 'Failed to fetch student details',
            error: error.message
        });
    }
};

// Bulk update student status
exports.bulkUpdateStatus = async (req, res) => {
    try {
        const { enrollmentIds, studentStatus, reason } = req.body;
        
        const updates = await Enrollment.updateMany(
            { _id: { $in: enrollmentIds } },
            { 
                studentStatus,
                lastStatusUpdate: new Date(),
                statusUpdateReason: reason
            }
        );

        // Log activities
        const activities = enrollmentIds.map(enrollmentId => ({
            user: enrollmentId,
            performedBy: req.user._id,
            action: 'bulk_update_status',
            details: `Student status bulk updated to ${studentStatus}`,
            metadata: {
                newStatus: studentStatus,
                reason: reason
            }
        }));

        await Activity.insertMany(activities);

        res.json({
            message: `Successfully updated ${updates.modifiedCount} student(s)`,
            modifiedCount: updates.modifiedCount
        });
    } catch(error) {
        console.error('Error in bulkUpdateStatus:', error);
        res.status(500).json({
            message: 'Failed to perform bulk status update',
            error: error.message
        });
    }
};

// Create student
exports.createStudent = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const studentData = req.body;

        // Create user account first
        const userData = {
            email: studentData.email,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            phoneNumber: studentData.phoneNumber,
            role: 'student',
            status: 'active'
        };

        const user = await User.create(userData);

        // Generate admission number
        const admissionNumber = await generateAdmissionNumber(schoolId);

        // Create student record
        const student = await Student.create({
            user: user._id,
            school: schoolId,
            class: studentData.class,
            stream: studentData.stream,
            admissionNumber,
            dateOfBirth: studentData.dateOfBirth,
            gender: studentData.gender,
            address: studentData.address,
            guardian: studentData.guardian,
            medicalInfo: studentData.medicalInfo,
            documents: studentData.documents
        });

        // Create enrollment record
        await Enrollment.create({
            student: student._id,  
            school: schoolId,
            studentStatus: 'Active'
        });

        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
};

// Get students
exports.getStudents = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { page = 1, limit = 10, search, class: studentClass, stream } = req.query;

        const query = { school: schoolId };

        // Add filters
        if (search) {
            const userIds = await User.find({
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).distinct('_id');

            query.user = { $in: userIds };
        }

        if (studentClass) query.class = studentClass;
        if (stream) query.stream = stream;

        const students = await Student.find(query)
            .populate('user', 'firstName lastName email phoneNumber')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Student.countDocuments(query);

        res.status(200).json({
            success: true,
            data: students,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};

// Get student
exports.getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id)
            .populate('user', 'firstName lastName email phoneNumber avatar')
            .populate('school', 'name type category');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student',
            error: error.message
        });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Update user data if provided
        if (updateData.firstName || updateData.lastName || updateData.email || updateData.phoneNumber) {
            const userData = {};
            if (updateData.firstName) userData.firstName = updateData.firstName;
            if (updateData.lastName) userData.lastName = updateData.lastName;
            if (updateData.email) userData.email = updateData.email;
            if (updateData.phoneNumber) userData.phoneNumber = updateData.phoneNumber;

            const student = await Student.findById(id);
            await User.findByIdAndUpdate(student.user, userData);
        }

        // Remove user update fields from student update
        delete updateData.firstName;
        delete updateData.lastName;
        delete updateData.email;
        delete updateData.phoneNumber;

        // Update student data
        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('user', 'firstName lastName email phoneNumber avatar');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Delete enrollment record
        await Enrollment.findOneAndDelete({ student: student.user });

        // Delete student record
        await student.remove();

        // Delete user account
        await User.findByIdAndDelete(student.user);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
};

// Add academic record
exports.addAcademicRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const recordData = req.body;

        const student = await Student.findByIdAndUpdate(
            id,
            { $push: { academicRecords: recordData } },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error adding academic record:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding academic record',
            error: error.message
        });
    }
};

// Add fee record
exports.addFeeRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const feeData = req.body;

        const student = await Student.findByIdAndUpdate(
            id,
            { $push: { feeRecords: feeData } },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error adding fee record:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding fee record',
            error: error.message
        });
    }
};

// Add disciplinary record
exports.addDisciplinaryRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const recordData = req.body;

        const student = await Student.findByIdAndUpdate(
            id,
            { $push: { disciplinaryRecords: recordData } },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error adding disciplinary record:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding disciplinary record',
            error: error.message
        });
    }
};