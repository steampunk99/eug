const express = require('express');
const router = express.Router();
const { authenticateSession, requireRole } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');
const { uploads } = require('../config/cloudinary');

// Get overview statistics for super admin dashboard
router.get('/superadmin/overview', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getSuperAdminOverview
);

// Get recent activities
router.get('/activities/recent', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getRecentActivities
);

// Get user statistics
router.get('/stats/users', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getUserStats
);

// Get school statistics
router.get('/stats/schools', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getSchoolStats
);

// Get application statistics
router.get('/stats/applications', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getApplicationStats
);

// Get combined dashboard statistics
router.get('/stats', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getDashboardStats
);

// User Role Management Routes
router.get('/users/roles', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getUserRoles
);

router.post('/users/roles',
    authenticateSession,
    requireRole('superadmin'),
    dashboardController.createRole
);

router.get('/users/roles/:roleId/permissions', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getRolePermissions
);

router.put('/users/roles/:roleId/permissions', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.updateRolePermissions
);

// User Management Routes
router.get('/users', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getAllUsers
);

router.get('/users/:id', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.getUser
);

router.post('/users', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.createUser
);

router.patch('/users/:id', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.updateUser
);

router.patch('/users/:id/status', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.updateUserStatus
);

router.delete('/users/:id', 
    authenticateSession, 
    requireRole('superadmin'), 
    dashboardController.deleteUser
);

// Avatar upload route
router.post('/users/avatar',
    authenticateSession,
    requireRole('superadmin'),
    uploads.avatars.single('avatar'),
    dashboardController.uploadAvatar
);

// User Activity Routes
router.get('/activities', dashboardController.getUserActivities);

module.exports = router;
