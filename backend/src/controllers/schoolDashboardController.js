const Application = require('../models/Application');
const School = require('../models/School');
const mongoose = require('mongoose');

// Get school dashboard statistics
exports.getSchoolDashboardStats = async (req, res) => {
    try {
        const { schoolId } = req.params;

        // Validate schoolId
        if (!schoolId || !mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid school ID provided'
            });
        }

        const schoolObjectId = new mongoose.Types.ObjectId(schoolId);

        // Verify school exists and user has permission
        const school = await School.findById(schoolObjectId);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: 'School not found'
            });
        }

        // Get application statistics
        const applicationStats = await Application.aggregate([
            { $match: { school: schoolObjectId } },
            {
                $group: {
                    _id: '$applicationStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert stats array to object
        const statusDistribution = applicationStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {
            Pending: 0,
            Approved: 0,
            Rejected: 0
        });

        // Calculate total applications
        const totalApplications = Object.values(statusDistribution).reduce((a, b) => a + b, 0);

        // Get recent applications
        const recentApplications = await Application.find({ school: schoolObjectId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('applicationStatus createdAt personalInfo')
            .lean();

        // Get application trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const applicationTrends = await Application.aggregate([
            {
                $match: {
                    school: schoolObjectId,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalApplications,
                statusDistribution,
                recentApplications,
                applicationTrends: applicationTrends.map(trend => ({
                    date: `${trend._id.year}-${trend._id.month}`,
                    applications: trend.count
                }))
            }
        });

    } catch (error) {
        console.error('Error in getSchoolDashboardStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
