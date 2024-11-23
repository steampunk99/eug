const nodemailer = require('nodemailer')

// CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Email templates for different application statuses
const emailTemplates = {
    Approved: {
        subject: 'Application Approved - EnrollUG',
        text: (studentName) => `
Dear ${studentName},

We are pleased to inform you that your application has been approved. 
Please log in to your account to view next steps and complete your enrollment process.

Best regards,
EnrollUG Team
        `
    },
    Rejected: {
        subject: 'Application Status Update - EnrollUG',
        text: (studentName) => `
Dear ${studentName},

Thank you for your interest in our school. After careful review of your application,
we regret to inform you that we are unable to offer you admission at this time.

Best regards,
EnrollUG Team
        `
    },
    InterviewScheduled: {
        subject: 'Interview Scheduled - EnrollUG',
        text: (studentName, date, time, location) => `
Dear ${studentName},

Your interview has been scheduled for ${date} at ${time}.
Location: ${location}

Please arrive 15 minutes before your scheduled time.
If you need to reschedule, please contact us as soon as possible.

Best regards,
EnrollUG Team
        `
    }
};

// SEND EMAIL
exports.sendEmail = async (to, template, data) => {
    try {
        if (!emailTemplates[template]) {
            throw new Error(`Email template '${template}' not found`);
        }

        const { subject, text } = emailTemplates[template];
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text: typeof text === 'function' ? text(...data) : text
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Verify email configuration
exports.verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('Email configuration verified successfully');
        return true;
    } catch (error) {
        console.error('Email configuration verification failed:', error);
        return false;
    }
};