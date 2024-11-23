const School = require('../models/School');

const validateStaffPermissions = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Superadmin bypass - they have all permissions
      if (req.user.role === 'superadmin') {
        return next();
      }

      const school = await School.findById(req.params.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }

      // Find the user's staff record in the school
      const staffMember = school.staff.find(
        (staff) => staff.user.toString() === req.user._id.toString()
      );

      if (!staffMember) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Check if user has the required permission
      if (!staffMember.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      console.error('Permission validation error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = {
  validateStaffPermissions
};
