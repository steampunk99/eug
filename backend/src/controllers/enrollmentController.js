const Enrollment = require('../models/Enrollment')

// enroll student
exports.enrollStudent = async (req, res) => {
    try {
        const {studentId, schoolId,studentStatus} = req.body

        const newEnrollment = new Enrollment({
            student: studentId,
            school:schoolId,
            studentStatus:studentStatus
            
        })

        await newEnrollment.save()
        res.status(201).json({message: 'Student enrolled successfully',newEnrollment:newEnrollment})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error: error.message})
    }
}

// get enrollments
exports.getSchoolEnrollments = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        console.log('getSchoolEnrollments called with schoolId:', schoolId);
        
        const enrollments = await Enrollment.find({ school: schoolId })
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email phoneNumber'
                }
            });

        console.log('Found enrollments:', JSON.stringify(enrollments, null, 2));
        
        // Filter out enrollments with null students
        const validEnrollments = enrollments.filter(enrollment => enrollment.student !== null);
        console.log('Valid enrollments:', JSON.stringify(validEnrollments, null, 2));
        
        res.status(200).json({
            success: true,
            data: validEnrollments
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: 'server error', error: error.message});
    }
}
