const mongoose = require('mongoose')

const StaffSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required:true},
    school: {type: mongoose.Types.ObjectId, ref: 'School', required:true},
    position: {type: String, required:true}
})

module.exports = mongoose.model('Staff', StaffSchema)