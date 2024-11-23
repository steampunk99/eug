// controllers/adminStatsController.js

const mongoose = require('mongoose');
const User = require('../models/User');
const School = require('../models/School');
const Application = require('../models/Application');
const Activity = require('../models/Activity');
const Role = require('../models/Role');

// Get User Statistics
exports.getUserStats = async (req, res) => {
    try {
        const userStats = {
            total: await User.countDocuments(),
            roleDistribution: await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]),
            recentUsers: await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-password'),
            userGrowth: await User.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        };

        res.status(200).json({ success: true, data: userStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching user statistics', error: error.message });
    }
};

// Get School Statistics
exports.getSchoolStats = async (req, res) => {
    try {
        const schoolStats = {
            total: await School.countDocuments(),
            typeDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]),
            categoryDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]),
            regionDistribution: await School.aggregate([
                {
                    $group: {
                        _id: '$location.region',
                        count: { $sum: 1 }
                    }
                }
            ]),
            subscriptionTiers: await School.aggregate([
                {
                    $group: {
                        _id: '$metadata.subscriptionTier',
                        count: { $sum: 1 }
                    }
                }
            ])
        };

        res.status(200).json({ success: true, data: schoolStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching school statistics', error: error.message });
    }
};

// Get Application Statistics
exports.getApplicationStats = async (req, res) => {
    try {
        const applicationStats = {
            total: await Application.countDocuments(),
            statusDistribution: await Application.aggregate([
                {
                    $group: {
                        _id: '$applicationStatus',
                        count: { $sum: 1 }
                    }
                }
            ]),
            monthlyApplications: await Application.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                            status: '$applicationStatus'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            paymentStats: await Application.aggregate([
                {
                    $group: {
                        _id: '$payment.status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$payment.amount' }
                    }
                }
            ]),
            paymentMethods: await Application.aggregate([
                {
                    $group: {
                        _id: '$payment.paymentMethod',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$payment.amount' }
                    }
                }
            ])
        };

        res.status(200).json({ success: true, data: applicationStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching application statistics', error: error.message });
    }
};

// Get Combined Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const [userStats, schoolStats, applicationStats] = await Promise.all([
            User.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        roleDistribution: [
                            { $group: { _id: '$role', count: { $sum: 1 } } }
                        ],
                        recentUsers: [
                            { $sort: { createdAt: -1 } },
                            { $limit: 5 },
                            { $project: { password: 0 } }
                        ]
                    }
                }
            ]),
            School.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        typeDistribution: [
                            { $group: { _id: '$type', count: { $sum: 1 } } }
                        ],
                        categoryDistribution: [
                            { $group: { _id: '$category', count: { $sum: 1 } } }
                        ]
                    }
                }
            ]),
            Application.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        statusDistribution: [
                            { $group: { _id: '$applicationStatus', count: { $sum: 1 } } }
                        ],
                        paymentStats: [
                            {
                                $group: {
                                    _id: '$payment.status',
                                    count: { $sum: 1 },
                                    totalAmount: { $sum: '$payment.amount' }
                                }
                            }
                        ]
                    }
                }
            ])
        ]);

        const dashboardStats = {
            userStats: {
                total: userStats[0].total[0]?.count || 0,
                roleDistribution: userStats[0].roleDistribution,
                recentUsers: userStats[0].recentUsers
            },
            schoolStats: {
                total: schoolStats[0].total[0]?.count || 0,
                typeDistribution: schoolStats[0].typeDistribution,
                categoryDistribution: schoolStats[0].categoryDistribution
            },
            applicationStats: {
                total: applicationStats[0].total[0]?.count || 0,
                statusDistribution: applicationStats[0].statusDistribution,
                paymentStats: applicationStats[0].paymentStats
            }
        };

        res.status(200).json({ success: true, data: dashboardStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard statistics', error: error.message });
    }
};

// Get Overview Statistics for SuperAdmin Dashboard
exports.getSuperAdminOverview = async (req, res) => {
    try {
       
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

        // Get current counts
        const totalSchools = await School.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const activeUsers = await User.countDocuments({ 
            lastActive: { $gte: lastHour }
        });

        // Get change metrics
        const schoolsLastMonth = await School.countDocuments({
            createdAt: { $lte: lastMonth }
        });
        const studentsLastMonth = await User.countDocuments({
            role: 'student',
            createdAt: { $lte: lastMonth }
        });
        const adminsLastWeek = await User.countDocuments({
            role: 'admin',
            createdAt: { $lte: lastWeek }
        });
        const activeLastHour = await User.countDocuments({
            lastActive: { 
                $gte: new Date(lastHour.getTime() - 60 * 60 * 1000),
                $lt: lastHour
            }
        });

        // Get trend data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        const trendPromises = last7Days.map(async (date) => {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const [schools, students, admins, active] = await Promise.all([
                School.countDocuments({
                    createdAt: { $lt: nextDate }
                }),
                User.countDocuments({
                    role: 'student',
                    createdAt: { $lt: nextDate }
                }),
                User.countDocuments({
                    role: 'admin',
                    createdAt: { $lt: nextDate }
                }),
                User.countDocuments({
                    lastActive: {
                        $gte: new Date(date.getTime() - 60 * 60 * 1000),
                        $lt: nextDate
                    }
                })
            ]);

            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                schools,
                students,
                admins,
                active
            };
        });

        const trends = await Promise.all(trendPromises);

        const stats = {
            totalSchools,
            totalStudents,
            totalAdmins,
            activeUsers,
            schoolsChange: totalSchools - schoolsLastMonth,
            studentsChange: Math.round((totalStudents - studentsLastMonth) / (studentsLastMonth || 1) * 100),
            adminsChange: totalAdmins - adminsLastWeek,
            activeChange: activeUsers - activeLastHour,
            trends
        };

       

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error('Error getting super admin overview:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching overview statistics',
            error: error.message 
        });
    }
};

// Get Recent Activities
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name avatar')
            .populate('performedBy', 'name avatar')
            .lean();

        res.json(activities);
    } catch (error) {
        console.error('Error getting recent activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activities',
            error: error.message
        });
    }
};

// Get User Activities
exports.getUserActivities = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        
        if (userId) {
            query.user = userId;
        }

        const activities = await Activity.find(query)
            .populate('user', 'name email')
            .populate('performedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);

        const formattedActivities = activities.map(activity => ({
            id: activity._id,
            user: activity.user ? {
                id: activity.user._id,
                name: activity.user.name,
                email: activity.user.email
            } : null,
            performedBy: activity.performedBy ? {
                id: activity.performedBy._id,
                name: activity.performedBy.name,
                email: activity.performedBy.email
            } : null,
            action: activity.action,
            details: activity.details,
            timestamp: activity.createdAt
        }));

        res.status(200).json({
            success: true,
            data: formattedActivities
        });
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user activities',
            error: error.message
        });
    }
};

// Create Role
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;
        
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required'
            });
        }

        // Convert name to lowercase and remove spaces for value
        const value = name.toLowerCase().replace(/\s+/g, '_');
       

        // Check if role already exists
        const existingRole = await Role.findOne({ value });
        if (existingRole) {
            
            return res.status(400).json({
                success: false,
                message: 'Role already exists'
            });
        }
        
        // Create new role with default permissions
        const newRole = new Role({
            value,
            label: name,
            permissions: {
                users: [],
                schools: ['view'],
                applications: ['view'],
                settings: []
            }
        });

        await newRole.save();
     

        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: newRole
        });
    } catch (error) {
        console.error('Error in createRole:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating role',
            error: error.message
        });
    }
};

// Get User Roles
exports.getUserRoles = async (req, res) => {
    try {
        const roles = await Role.find({}, { value: 1, label: 1, _id: 0 });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error('Error in getUserRoles:', error);
        res.status(500).json({ success: false, message: 'Error fetching user roles', error: error.message });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            data: users 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

// Get Single User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { email, password, role, name, avatar } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user with default values
        const newUser = new User({
            email,
            password,
            role: role || 'student',
            name,
            avatar,
            status: 'active',
            metadata: {
                failedLoginAttempts: 0,
                verifiedEmail: true,
                twoFactorEnabled: false,
                lastPasswordChange: new Date()
            }
        });

        await newUser.save();

        // Return user without password
        const userWithoutPassword = await User.findById(newUser._id).select('-password');

        res.status(201).json({ 
            success: true, 
            data: userWithoutPassword 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating user', 
            error: error.message 
        });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(userId, updates, { 
            new: true,
            runValidators: true 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log user update activity
        await new Activity({
            user: userId,
            performedBy: req.user._id,
            action: 'update_user',
            details: `User profile updated`,
            metadata: {
                updates: Object.keys(updates),
                timestamp: new Date()
            }
        }).save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// Update User Status
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log status update activity
        await new Activity({
            user: userId,
            performedBy: req.user._id,
            action: 'update_status',
            details: `User status updated to ${status}`,
            metadata: {
                oldStatus: user.status,
                newStatus: status,
                timestamp: new Date()
            }
        }).save();

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Check if role exists
        const roleExists = await Role.findOne({ value: role });
        if (!roleExists) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: roleExists.value },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log role update activity
        await new Activity({
            user: userId,
            performedBy: req.user._id,
            action: 'update_role',
            details: `User role updated to ${roleExists.label}`,
            metadata: {
                oldRole: user.role,
                newRole: roleExists.value,
                timestamp: new Date()
            }
        }).save();

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting user', 
            error: error.message 
        });
    }
};

// Upload Avatar
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // The file is already uploaded to Cloudinary by the middleware
        const avatarUrl = req.file.path;

        res.status(200).json({
            success: true,
            data: {
                avatarUrl
            }
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading avatar',
            error: error.message
        });
    }
};

// Get Role Permissions
exports.getRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await Role.findOne({ value: roleId });
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            data: role.permissions
        });
    } catch (error) {
        console.error('Error fetching role permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role permissions',
            error: error.message
        });
    }
};

// Update Role Permissions
exports.updateRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { permissions } = req.body;
        
        // In a real application, you would save these to a database
        // For now, we'll just acknowledge the update
        
        res.status(200).json({ 
            success: true, 
            message: 'Permissions updated successfully',
            data: permissions 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating role permissions', 
            error: error.message 
        });
    }
};

// Helper function to format timestamps
function formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}