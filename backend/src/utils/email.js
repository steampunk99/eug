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

// SEND EMAIL
exports.sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text
    }

    await transporter.sendMail(mailOptions)
}