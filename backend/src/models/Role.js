const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    label: {
        type: String,
        required: true
    },
    permissions: {
        users: [String],
        schools: [String],
        applications: [String],
        settings: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add default roles if none exist
roleSchema.statics.initializeDefaultRoles = async function() {
    const defaultRoles = [
        {
            value: 'student',
            label: 'Student',
            permissions: {
                users: [],
                schools: ['view'],
                applications: ['view'],
                settings: []
            }
        },
        {
            value: 'admin',
            label: 'Staff',
            permissions: {
                users: ['view'],
                schools: ['view', 'edit'],
                applications: ['view', 'process'],
                settings: ['view']
            }
        },
        {
            value: 'superadmin',
            label: 'Super Admin',
            permissions: {
                users: ['view', 'create', 'edit', 'delete'],
                schools: ['view', 'approve', 'reject', 'edit'],
                applications: ['view', 'process', 'approve', 'reject'],
                settings: ['view', 'edit']
            }
        }
    ];

    const count = await this.countDocuments();
    if (count === 0) {
        await this.insertMany(defaultRoles);
    }
};

const Role = mongoose.model('Role', roleSchema);

// Initialize default roles when the model is first loaded
Role.initializeDefaultRoles().catch(console.error);

module.exports = Role;
