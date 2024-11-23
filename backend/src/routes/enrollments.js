const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateSession } = require('../middleware/auth');

// Get enrollments for a school
router.get('/school/:schoolId', authenticateSession, enrollmentController.getSchoolEnrollments);

// Create new enrollment
router.post('/', authenticateSession, enrollmentController.enrollStudent);

module.exports = router;
