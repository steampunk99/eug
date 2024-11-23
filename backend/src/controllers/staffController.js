const Staff = require('../models/Staff');
const School = require('../models/School');
const User = require('../models/User');

// Get school staff members
exports.getSchoolStaff = async (req, res) => {
  console.log('GET /:schoolId/staff called with schoolId:', req.params.schoolId);
  try {
    const school = await School.findById(req.params.schoolId)
      .populate('staff.user', 'name email')
      .select('staff');

    if (!school) {
      console.log('School not found:', req.params.schoolId);
      return res.status(404).json({ message: 'School not found' });
    }

    console.log('Found school staff:', school.staff);
    res.json(school.staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add staff member
exports.addStaffMember = async (req, res) => {
  console.log('POST /:schoolId/staff called with schoolId:', req.params.schoolId);
  try {
    const { email, role, permissions } = req.body;
    const school = await School.findById(req.params.schoolId);

    if (!school) {
      console.log('School not found:', req.params.schoolId);
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a staff member
    const existingStaff = school.staff.find(
      (staff) => staff.user.toString() === user._id.toString()
    );
    if (existingStaff) {
      console.log('User is already a staff member:', email);
      return res.status(400).json({ message: 'User is already a staff member' });
    }

    // Add staff member
    school.staff.push({
      user: user._id,
      role,
      permissions,
      assignedBy: req.user._id,
      assignedAt: Date.now(),
      status: 'pending'
    });

    await school.save();

    const newStaff = school.staff[school.staff.length - 1];
    await School.populate(newStaff, { path: 'user', select: 'name email' });

    console.log('Staff member added:', newStaff);
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update staff member
exports.updateStaffMember = async (req, res) => {
  console.log('PUT /:schoolId/staff/:staffId called with schoolId:', req.params.schoolId, 'and staffId:', req.params.staffId);
  try {
    const { role, permissions, status } = req.body;
    const school = await School.findById(req.params.schoolId);

    if (!school) {
      console.log('School not found:', req.params.schoolId);
      return res.status(404).json({ message: 'School not found' });
    }

    const staffMember = school.staff.id(req.params.staffId);
    if (!staffMember) {
      console.log('Staff member not found:', req.params.staffId);
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Update staff member
    staffMember.role = role;
    staffMember.permissions = permissions;
    staffMember.status = status;

    await school.save();
    await School.populate(staffMember, { path: 'user', select: 'name email' });

    console.log('Staff member updated:', staffMember);
    res.json(staffMember);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove staff member
exports.removeStaffMember = async (req, res) => {
  console.log('DELETE /:schoolId/staff/:staffId called with schoolId:', req.params.schoolId, 'and staffId:', req.params.staffId);
  try {
    const school = await School.findById(req.params.schoolId);

    if (!school) {
      console.log('School not found:', req.params.schoolId);
      return res.status(404).json({ message: 'School not found' });
    }

    const staffMember = school.staff.id(req.params.staffId);
    if (!staffMember) {
      console.log('Staff member not found:', req.params.staffId);
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staffMember.remove();
    await school.save();

    console.log('Staff member removed:', req.params.staffId);
    res.json({ message: 'Staff member removed successfully' });
  } catch (error) {
    console.error('Error removing staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Associate user with school
exports.associateUser = async (req, res) => {
  try {
    console.log('Associating user with school...');
    const { userId, role, permissions } = req.body;
    const school = await School.findById(req.params.schoolId);

    if (!school) {
      console.log('School not found:', req.params.schoolId);
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already associated with this school
    const existingAssociation = school.staff.find(
      (staff) => staff.user.toString() === userId.toString()
    );

    if (existingAssociation) {
      console.log('User is already associated with this school:', userId);
      return res.status(400).json({ message: 'User is already associated with this school' });
    }

    // Add user to school staff
    school.staff.push({
      user: userId,
      role: role || 'staff', // default role
      permissions: permissions || ['view_reports'], // default permissions
      assignedBy: req.user._id,
      assignedAt: Date.now(),
      status: 'active'
    });

    await school.save();

    // Populate user details in the response
    const newStaffMember = school.staff[school.staff.length - 1];
    await School.populate(newStaffMember, { path: 'user', select: 'name email' });

    console.log('User associated with school:', newStaffMember);
    res.status(201).json(newStaffMember);
  } catch (error) {
    console.error('Error associating user with school:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
