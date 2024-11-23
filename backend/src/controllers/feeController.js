const Fee = require("../models/Fee")

// add fee
exports.addFee = async(req, res) => {
    try {
        const {school, name, amount, dueDate, description} = req.body

        const newFee = new Fee({school, name, amount, dueDate, description})

        await newFee.save()

        res.status(201).json({message: 'Fee added successfully', newFee})

    } catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error:error.message})
    }
}


// get fees
exports.getSchoolFees = async(req, res) => {
    try {
        const schoolId = req.params.schoolId
        const fees = await Fee.find({School:schoolId})

        res.json(fees)
    }
     catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error:error.message})
     }
}