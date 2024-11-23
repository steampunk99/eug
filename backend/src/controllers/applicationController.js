const Application = require("../models/Application")
const {sendEmail} = require('../utils/emailService')
const School = require('../models/School')
const User = require('../models/User')

// Submit application
exports.submitApplication = async (req, res) => {
    try {
        const { schoolId, personalInfo, academicInfo, essayAnswer } = req.body;
        const userId = req.user._id;

        // Validate input data
        const validationError = validateApplicationData({ personalInfo, academicInfo });
        if (validationError) {
            return res.status(400).json({ message: 'Validation error', errors: validationError });
        }

        // Check if user has already applied to this school
        const existingApplication = await Application.findOne({ 
            user: userId, 
            school: schoolId,
            applicationStatus: { $in: ['Pending', 'Approved'] }
        });

        if (existingApplication) {
            return res.status(400).json({ 
                message: 'You already have an active application for this school',
                applicationId: existingApplication._id
            });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found.' });
        }

        // Check if applications are still open
        if (school.admissions.applicationDeadline < new Date()) {
            return res.status(400).json({ 
                message: 'Applications are closed for this school' 
            });
        }

        // Check if spots are available
        if (school.admissions.availableSpots.dayStudents <= 0 && 
            school.admissions.availableSpots.boardingStudents <= 0) {
            return res.status(400).json({ 
                message: 'No available spots in this school' 
            });
        }

        const newApplication = new Application({
            user: userId,
            school: schoolId,
            personalInfo,
            academicInfo,
            essayAnswer,
            payment: {
                amount: school.fees.admissionFee,
                status: 'Pending'
            }
        });
        
        await newApplication.save();
        await User.findByIdAndUpdate(userId, { 
            $push: { applications: newApplication._id } 
        });

        // Send notification emails
        await Promise.all([
            sendEmail(
                req.user.email, 
                'Application Submitted Successfully',
                `Your application to ${school.name} has been submitted. Please complete the payment of ${school.fees.admissionFee} UGX to proceed.`
            ),
            sendEmail(
                school.contact.email,
                'New Student Application',
                `A new student application has been received from ${personalInfo.name}.`
            )
        ]);
        
        res.status(201).json({ 
            message: 'Application submitted successfully',
            applicationId: newApplication._id,
            paymentAmount: school.fees.admissionFee
        });
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({ 
            message: 'Failed to submit application', 
            error: error.message 
        });
    }
};

// Process payment
exports.processPayment = async (req, res) => {
    try {
        const { applicationId, paymentMethod, phoneNumber } = req.body;

        // Validate payment method and phone number
        if (!['MTN-Uganda', 'Airtel-Uganda'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        if (!phoneNumber?.match(/^(256|0)(7[0-8])[0-9]{7}$/)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        const application = await Application.findById(applicationId)
            .populate('school')
            .populate('user');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.payment.status === 'Completed') {
            return res.status(400).json({ message: 'Payment already completed' });
        }

        let paymentResponse;
        const paymentData = {
            phoneNumber,
            amount: application.payment.amount,
            description: `Application fee for ${application.school.name}`,
            reference: `APP-${applicationId}`
        };

        if (paymentMethod === 'MTN-Uganda') {
            paymentResponse = await initiateMTNPayment(paymentData);
        } else {
            paymentResponse = await initiateAirtelPayment(paymentData);
        }

        // Update application with payment details
        application.payment.status = 'Processing';
        application.payment.transactionId = paymentResponse.transactionId;
        application.payment.paymentMethod = paymentMethod;
        await application.save();

        res.status(200).json({
            message: 'Payment initiated successfully',
            transactionId: paymentResponse.transactionId,
            status: 'Processing'
        });

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ 
            message: 'Payment processing failed', 
            error: error.message 
        });
    }
};

// approve application
exports.approveApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId).populate('school');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicationStatus === 'Approved') {
            return res.status(400).json({ message: 'Application is already approved' });
        }

        // Check if the user has permission to approve this application
        if (req.user.role === 'school' && application.school._id.toString() !== req.user.school.toString()) {
            return res.status(403).json({ message: 'You do not have permission to approve this application' });
        }

        application.applicationStatus = 'Approved';
        await application.save();

        try {
            await sendEmail(
                application.user.email,
                'Application Approved',
                `Congratulations! Your application has been approved.`
            );
        } catch (emailError) {
            console.error('Error sending approval email:', emailError);
            return res.status(500).json({ message: 'Error sending approval email' });
        }

        res.json({ message: 'Application approved', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// get all applications
exports.getSchoolApplications = async(req, res) => {
    try {
        const schoolId = req.params.schoolId
        const applications = await Application.find({school:schoolId})
        .populate('user', 'username email')
        .sort('-createdAt')

        res.json(applications)
    } catch(error){
        console.error(error)
        res.status(500).json({message: 'server error', error: error.message})
    }
}

// update application status
exports.updateApplicationStatus = async(req, res)=> {
    try {
        const {applicationId} = req.params
        const {applicationStatus} = req.body

        const application = await Application.findByIdAndUpdate(
            applicationId, {applicationStatus},
            {new:true, runValidators:true}
        )

        if(!application) {
            res.status(404).json({message: "Student application not found"})
        }

        res.json({message: "Application status updated successfully", application: application})
    } 
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error'})
    }
}


// helper functions for payments
async function initiateMTNPayment(application) {
    // will implement mtn api call
    // and return transaction details
}
async function initiateAirtelPayment(application) {
    // will implement mtn api call
    // and return transaction details 
}