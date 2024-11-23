const mongoose = require('mongoose')

const ProgramSchema = new mongoose.Schema({
    name: {type: String, required: true},
    school: {type: mongoose.Schema.Types.ObjectId,ref: 'School', required:true},
    description: String,
    duration: String,
    fees: Number
})

module.exports = mongoose.model('Program', ProgramSchema)