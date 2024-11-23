const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const SchoolSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        index: true
    },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description:{
        type:String
    },

    location: {
        district: { type: String, required: true },
        region: { type: String, required: true }, // Northern, Eastern, Western, Central
        address: { type: String, required: true },
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: [Number] // [longitude, latitude]
        }
    },
    type: { 
        type: String, 
        required: true,
        enum: ['Day', 'Boarding', 'Mixed'] // Ugandan school types
    },
    category: {
        type: String,
        required: true,
        enum: ['Government', 'Private', 'Religious', 'International'] // Common categories in Uganda
    },
    fees: {
        admissionFee: { type: Number, required: true },
        tuitionFee: {
            dayStudent: Number,
            boardingStudent: Number
        },
        otherFees: [{
            name: String, // e.g., Development fee, Library fee
            amount: Number,
            term: String // which term this applies to
        }]
    },
    curriculum: {
        type: [String],
        enum: ['O-Level', 'A-Level', 'Cambridge'], // Ugandan secondary education levels
        required: true
    },
    subjects: {
        oLevel: [String], // UCE subjects offered
        aLevel: [String],  // UACE subject combinations offered
        cambridge: [String],  // Cambridge subject combinations offered
    },
    staff: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { 
            type: String, 
            enum: ['principal', 'administrator', 'deputy', 'staff'],
            required: true 
        },
        permissions: [{
            type: String,
            enum: ['manage_staff', 'manage_students', 'manage_applications', 'view_reports', 'edit_school']
        }],
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedAt: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ['active', 'inactive', 'pending'],
            default: 'pending'
        }
    }],
    performance: {
        UCE: {
            lastResults: String, // Latest year
            div1Count: Number,
            div2Count: Number
        },
        UACE: {
            lastResults: String, // Latest year
            div1Count: Number,
            div2Count: Number
        }
    },
    facilities: [{
        name: String, // e.g., Laboratory, Library, Sports field
        description: String
    }],
    contact: {
        email: String,
        phone: { type: String, required: true },
        alternativePhone: String,
        website: String
    },
    media: {
        logo: String,
        gallery: [{
            url: String,
            caption: String,
            isMain: { type: Boolean, default: false }
        }]
    },
    admissions: {
        applicationDeadline: { type: Date, required: true },
        availableSpots: {
            dayStudents: Number,
            boardingStudents: Number
        },
        requirements: [{
            name: String,
            required: Boolean
        }],
        termDates: [{
            term: String,
            startDate: Date,
            endDate: Date
        }]
    },
    stats: {
        studentCount: Number,
        teacherCount: Number,
        classSize: Number,
        boardingCapacity: Number
    },
    extraCurricular: [{
        name: String, // e.g., Football, Music, Dance & Drama
        description: String
    }],
    metadata: {
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        subscriptionTier: { 
            type: String, 
            enum: ['Basic', 'Premium','Standard'],
            default: 'Basic'
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
SchoolSchema.index({ 'location.district': 1, 'location.region': 1 });
SchoolSchema.index({ type: 1 });
SchoolSchema.index({ category: 1 });
SchoolSchema.index({ 'metadata.isVerified': 1 }); // Add index for verification status
SchoolSchema.index({ 'fees.tuitionFee.dayStudent': 1, 'fees.tuitionFee.boardingStudent': 1 });
SchoolSchema.index({ 
    name: 'text',
    'location.district': 'text',
    'location.region': 'text'
});

// Add pagination plugin
SchoolSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("School", SchoolSchema);