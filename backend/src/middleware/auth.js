const User = require('../models/User');

exports.authenticateSession = async (req, res, next) => {
    try {
        // Check if user is authenticated via session
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify user still exists in database
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.session.destroy();
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // Add fresh user data to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Role hierarchy
const roleHierarchy = {
    superadmin: ['superadmin', 'admin', 'student'],
    admin: ['admin', 'student'],
    student: ['student']
};

// Middleware to check user role with hierarchy support
exports.requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role;
        const allowedRoles = roleHierarchy[userRole] || [];

        if (!allowedRoles.includes(requiredRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        
        next();
    };
};