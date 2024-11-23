const mongoose = require("mongoose")

const EnrollmentSchema = new mongoose.Schema({
    student: {type:mongoose.Schema.Types.ObjectId, ref: 'Student'},
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    school: {type:mongoose.Schema.Types.ObjectId, ref:'School'},
    enrollmentDate: {type:Date, default:Date.now},
    studentStatus: {type:String, enum:['Active','Graduated', 'Withdrawn'],},
    grade: String,
    class: String,
    startDate: Date
})

module.exports = mongoose.model('Enrollment', EnrollmentSchema);