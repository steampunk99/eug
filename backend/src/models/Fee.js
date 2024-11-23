const mongoose = require('mongoose')

const FeeSchema = new mongoose.Schema({
    school: {type: mongoose.Schema.Types.ObjectId, ref: 'School', required:true},
    name: {type:String, required:true},
    amount: {type:Number, required:true},
    dueDate: Date,
    description:String
})

module.exports = mongoose.model('Fee', FeeSchema)