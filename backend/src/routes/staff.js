const express = require('express');
const router = express.Router();
const { authenticateSession, requireRole } = require('../middleware/auth');
const { validateStaffPermissions } = require('../middleware/permissions');
const staffController = require('../controllers/staffController');

// Get all staff for a school
router.get('/:schoolId/staff', authenticateSession, staffController.getSchoolStaff);

// Add a staff member
router.post('/:schoolId/staff', authenticateSession, validateStaffPermissions('manage_staff'), staffController.addStaffMember);

// Update a staff member
router.put('/:schoolId/staff/:staffId', authenticateSession, validateStaffPermissions('manage_staff'), staffController.updateStaffMember);

// Remove a staff member
router.delete('/:schoolId/staff/:staffId', authenticateSession, validateStaffPermissions('manage_staff'), staffController.removeStaffMember);

// Associate user with school
router.post('/:schoolId/associate-user', authenticateSession, validateStaffPermissions('superadmin'), staffController.associateUser);

module.exports = router;