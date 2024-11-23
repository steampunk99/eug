const User = require('../models/User')

// register a student
exports.registerStudent = async(req, res) => {
    try {
        const {username, email, password, firstName, lastName,phoneNumber} = req.body
        const user = new User({username,
             email, 
             password, 
             firstName,
              lastName,
              phoneNumber, 
              role:'student'})

        await user.save()
        res.status(201).json({message: 'Student account created successfully'})
    } catch(error) {
        console.error(error)
        res.status(500).json({message:'server error', error:error.message})

    }
}