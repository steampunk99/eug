// src/routes/schools.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const cloudinary = require('cloudinary').v2;
const schoolController = require('../controllers/schoolController');
const enrollmentController = require('../controllers/enrollmentController')
const applicationController = require('../controllers/applicationController')
const programController = require('../controllers/programController')
const staffController = require('../controllers/staffController');
const feeController = require('../controllers/feeController');
const dashboardController = require('../controllers/dashboardController');
const studentController = require('../controllers/studentController');
const schoolDashboardController = require('../controllers/schoolDashboardController');
const schoolApplicationController = require('../controllers/schoolApplicationController');
const applicationEnhancedController = require('../controllers/applicationEnhancedController');
const { authenticateSession, requireRole } = require('../middleware/auth');
const { uploads } = require('../config/cloudinary');

const School = require('../models/School');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateStaffPermissions } = require('../middleware/permissions');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for gallery
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school_gallery',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

// Configure multer for gallery uploads
const uploadGallery = multer({ storage: galleryStorage });

// Configure multer for document uploads
const uploadDocument = uploads.applicationDocuments;

// PUBLIC ROUTES
// Search schools
router.get('/search', schoolController.searchSchools);
router.get('/similar', schoolController.getSimilarSchools);
router.post('/application/submit', applicationController.submitApplication);
router.post('/application/pay', applicationController.processPayment);

// SUPER ADMIN ROUTES
router.get('/stats', authenticateSession, requireRole('superadmin'), schoolController.getSchoolStats);
router.get('/dashboard-stats', authenticateSession, requireRole('superadmin'), dashboardController.getDashboardStats);

// SCHOOL MANAGEMENT ROUTES
router.post('/add', authenticateSession, requireRole('superadmin'), schoolController.addSchools);
router.get('/:id', schoolController.getSchoolById);
router.get('/', schoolController.getAllSchools);
router.put('/:id', authenticateSession, requireRole('admin'), schoolController.updateSchool);
router.delete('/:id', authenticateSession, requireRole('superadmin'), schoolController.deleteSchool);

// Get school by admin ID
router.get('/admin/:adminId', authenticateSession, schoolController.getSchoolByAdminId);

// SCHOOL PROGRAMS
router.post('/programs/add', authenticateSession, requireRole('admin'), programController.addProgram);
router.get('/:schoolId/programs', programController.getSchoolPrograms);

// ENROLLMENT MANAGEMENT
router.post('/enroll', enrollmentController.enrollStudent);
router.get('/:schoolId/enrollments', authenticateSession, requireRole('admin'), enrollmentController.getSchoolEnrollments);

// STUDENT MANAGEMENT
router.get('/:schoolId/students', authenticateSession, requireRole('admin'), studentController.getSchoolStudents);
router.put('/students/:enrollmentId/status', authenticateSession, requireRole('admin'), studentController.updateStudentStatus);
router.get('/students/:enrollmentId', authenticateSession, requireRole('admin'), studentController.getStudentDetails);
router.post('/students/bulk-status-update', authenticateSession, requireRole('admin'), studentController.bulkUpdateStatus);

// STAFF MANAGEMENT
router.post('/staff', authenticateSession, requireRole('admin'), staffController.addStaffMember);
router.get('/:schoolId/staff', authenticateSession, requireRole('superadmin'), staffController.getSchoolStaff);

// FEES MANAGEMENT
router.post('/fees', authenticateSession, requireRole('admin'), feeController.addFee);
router.get('/:schoolId/fees', authenticateSession, requireRole('admin'), feeController.getSchoolFees);

// SCHOOL DASHBOARD
router.get('/:schoolId/dashboard-stats', authenticateSession, requireRole('admin'), schoolDashboardController.getSchoolDashboardStats);
router.get('/dashboard-stats', authenticateSession, requireRole('admin'), schoolController.getSchoolDashboardStats);

// APPLICATIONS MANAGEMENT
router.get('/:schoolId/applications', authenticateSession, requireRole('admin'), schoolApplicationController.getSchoolApplications);
router.get('/:schoolId/applications/:applicationId', authenticateSession, requireRole('admin'), schoolApplicationController.getApplicationDetails);
router.put('/:schoolId/applications/:applicationId/status', authenticateSession, requireRole('admin'), schoolApplicationController.updateApplicationStatus);

// ENHANCED APPLICATION FEATURES
router.post('/:schoolId/applications/batch-update', authenticateSession, requireRole('admin'), applicationEnhancedController.batchUpdateStatus);
router.get('/:schoolId/applications/export/excel', authenticateSession, requireRole('admin'), applicationEnhancedController.exportToExcel);
router.post('/applications/:applicationId/documents', 
  authenticateSession, 
  requireRole('admin'), 
  uploadDocument.single('document'), 
  applicationEnhancedController.uploadDocument
);
router.post('/:schoolId/applications/:applicationId/schedule-interview', authenticateSession, requireRole('admin'), applicationEnhancedController.scheduleInterview);

// GALLERY MANAGEMENT
router.post('/:id/gallery', authenticateSession, requireRole('admin'), uploadGallery.array('images', 10), schoolController.addGalleryImages);
router.delete('/:schoolId/gallery/:imageId', authenticateSession, requireRole('admin'), schoolController.removeGalleryImage);

module.exports = router;