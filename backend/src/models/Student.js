const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    school: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'School', 
        required: true 
    },
    // Academic Information
    class: {
        type: String,
        required: true,
        enum: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
    },
    stream: {
        type: String,
        default: 'A'
    },
    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    // Personal Information
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String,
        required: true
    },
    // Guardian Information
    guardian: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true,
            enum: ['Parent', 'Guardian', 'Other']
        },
        phone: {
            type: String,
            required: true
        },
        email: String,
        address: String,
        occupation: String
    },
    // Academic Records
    academicRecords: [{
        term: {
            type: String,
            required: true,
            enum: ['Term 1', 'Term 2', 'Term 3']
        },
        year: {
            type: Number,
            required: true
        },
        subjects: [{
            name: String,
            score: Number,
            grade: String,
            teacherRemarks: String
        }],
        attendance: {
            present: Number,
            absent: Number,
            excused: Number
        },
        classTeacherRemarks: String
    }],
    // Medical Information
    medicalInfo: {
        bloodGroup: String,
        allergies: [String],
        medications: [String],
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        }
    },
    // Extra-curricular Activities
    activities: [{
        name: String,
        role: String,
        achievements: [String],
        period: {
            start: Date,
            end: Date
        }
    }],
    // Documents
    documents: [{
        name: { 
            type: String, 
            required: true 
        },
        type: { 
            type: String, 
            required: true,
            enum: ['Birth Certificate', 'Previous School Records', 'Medical Records', 'Other']
        },
        url: { 
            type: String, 
            required: true 
        },
        uploadedAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    // Disciplinary Records
    disciplinaryRecords: [{
        date: Date,
        incident: String,
        action: String,
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Pending', 'Resolved', 'Escalated']
        }
    }],
    // Fee Records
    feeRecords: [{
        term: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paid: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: function() {
                return this.amount - this.paid;
            }
        },
        status: {
            type: String,
            enum: ['Paid', 'Partial', 'Unpaid'],
            default: 'Unpaid'
        },
        payments: [{
            amount: Number,
            date: Date,
            receiptNumber: String,
            paymentMethod: {
                type: String,
                enum: ['Cash', 'Bank Transfer', 'Mobile Money']
            }
        }]
    }],
    metadata: {
        isActive: { 
            type: Boolean, 
            default: true 
        },
        lastUpdated: { 
            type: Date, 
            default: Date.now 
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
StudentSchema.index({ 'user': 1, 'school': 1 });
StudentSchema.index({ 'admissionNumber': 1 });
StudentSchema.index({ 'class': 1 });
StudentSchema.index({ 'guardian.phone': 1 });
StudentSchema.index({ 'metadata.isActive': 1 });

module.exports = mongoose.model('Student', StudentSchema);
