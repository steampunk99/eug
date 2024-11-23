const mongoose = require("mongoose")

const ApplicationSchema = mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    school: {type:mongoose.Schema.Types.ObjectId, ref:'School', required:true},
    applicationStatus: {type:String,enum:['Pending','Approved','Rejected'], default:'Pending',required:true},
    personalInfo: {
        dateOfBirth: {type:Date, required:true},
        gender: {type:String, required:true},
        address: {type:String, required:true},
        name:{type:String, required:true}
    },
    academicInfo: {
        previousSchool: { type: String, required: true},
        grades: {type: String, required:true}
    },
    essayAnswer: {type:String, required: false},
    createdAt: {type: Date, default: Date.now},
    payment: {
        status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
        amount: { type: Number, required: true },
        transactionId: { type: String },
        paymentMethod: { type: String, enum: ['MTN-Uganda', 'Airtel-Uganda'] }
    },
    timeline: [{
        status: { type: String, required: true },
        comment: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }],
    documents: [{
        name: { type: String, required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }],
    interview: {
        scheduled: { type: Boolean, default: false },
        dateTime: { type: Date },
        location: { type: String },
        interviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        notes: { type: String },
        status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'], default: 'Pending' }
    },
    notifications: [{
        type: { type: String, enum: ['Email', 'SMS'], required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['Sent', 'Failed'], required: true }
    }]
})

module.exports = mongoose.model('Application', ApplicationSchema)
