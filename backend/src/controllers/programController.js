const Program = require('../models/Program')

// add a school program
exports.addProgram = async (req, res) => {
    try {
        const { name, school, description, duration, fees } = req.body;

        const newProgram = new Program({
            name, school, description, duration, fees
        });

        await newProgram.save();

        res.status(201).json({ message: 'Program added successfully', program: newProgram });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all school programs
exports.getSchoolPrograms = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        const programs = await Program.find({ school: schoolId });

        res.json(programs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};