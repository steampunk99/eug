const Application = require('../models/Application');
const mongoose = require('mongoose');

// Get school applications with filters and pagination
exports.getSchoolApplications = async (req, res) => {
    try {
        const { 
            status, 
            search, 
            startDate, 
            endDate, 
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const schoolId = req.params.schoolId;

        // Validate schoolId
        if (!mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid school ID format'
            });
        }

        // Base query
        const query = { school: new mongoose.Types.ObjectId(schoolId) };

        // Add filters if provided
        if (status) {
            query.applicationStatus = status;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (search) {
            query['personalInfo.name'] = new RegExp(search, 'i');
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination
        const total = await Application.countDocuments(query);

        // Execute query with pagination
        const applications = await Application.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email')
            .lean();

        return res.status(200).json({
            success: true,
            data: {
                applications,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error in getSchoolApplications:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify the application belongs to the school
        if (application.school.toString() !== req.params.schoolId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this application'
            });
        }

        application.applicationStatus = status;
        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

// Get application details
exports.getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('user', 'name email')
            .lean();

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify the application belongs to the school
        if (application.school.toString() !== req.params.schoolId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view this application'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application details',
            error: error.message
        });
    }
};
