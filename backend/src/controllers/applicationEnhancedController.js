const Application = require('../models/Application');
const { sendEmail } = require('../utils/emailService');
const ExcelJS = require('exceljs');
const { cloudinary, uploads } = require('../config/cloudinary');

// Batch update application statuses
exports.batchUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status, comment } = req.body;

    // Update all applications
    const updatePromises = applicationIds.map(async (id) => {
      const application = await Application.findById(id);
      if (!application) return null;

      // Add to timeline
      application.timeline.push({
        status,
        comment,
        timestamp: new Date(),
      });

      application.applicationStatus = status;
      
      // Send email notification
      try {
        await sendEmail(
          application.personalInfo.email,
          status,
          [application.personalInfo.name]
        );
      } catch (emailError) {
        console.error(`Failed to send email for application ${id}:`, emailError);
      }

      return application.save();
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Applications updated successfully' });
  } catch (err) {
    console.error('Error in batch update:', err);
    res.status(500).json({ error: 'Failed to update applications' });
  }
};

// Export applications to Excel
exports.exportToExcel = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) query.applicationStatus = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const applications = await Application.find(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Applied Date', key: 'appliedDate', width: 20 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Interview Status', key: 'interviewStatus', width: 15 },
    ];

    // Add rows
    applications.forEach((app) => {
      worksheet.addRow({
        name: app.personalInfo.name,
        email: app.personalInfo.email,
        status: app.applicationStatus,
        appliedDate: app.createdAt.toLocaleDateString(),
        paymentStatus: app.payment.status,
        interviewStatus: app.interview?.status || 'Not Scheduled',
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=applications.xlsx'
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    res.status(500).json({ error: 'Failed to export applications' });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // File is already uploaded to Cloudinary by the middleware
    const url = file.path;

    // Update application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.documents.push({
      name: file.originalname,
      url: url,
      type: file.mimetype,
      uploadedAt: new Date(),
    });

    await application.save();

    res.json({
      message: 'Document uploaded successfully',
      document: application.documents[application.documents.length - 1],
    });
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { dateTime, location, notes } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.interview = {
      scheduled: true,
      dateTime: new Date(dateTime),
      location,
      notes,
      status: 'Scheduled',
    };

    // Add to timeline
    application.timeline.push({
      status: 'InterviewScheduled',
      comment: `Interview scheduled for ${new Date(dateTime).toLocaleString()} at ${location}`,
      timestamp: new Date(),
    });

    // Send interview notification email
    try {
      const date = new Date(dateTime).toLocaleDateString();
      const time = new Date(dateTime).toLocaleTimeString();
      
      await sendEmail(
        application.personalInfo.email,
        'InterviewScheduled',
        [application.personalInfo.name, date, time, location]
      );
    } catch (emailError) {
      console.error('Failed to send interview notification email:', emailError);
    }

    await application.save();

    res.json({
      message: 'Interview scheduled successfully',
      interview: application.interview,
    });
  } catch (err) {
    console.error('Error scheduling interview:', err);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
};
