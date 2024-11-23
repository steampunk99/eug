const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    
    password: { type: String, select: false, required:false},  
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true },
    role: { 
        type: String,
        required: true,
        enum: ['student', 'admin', 'superadmin'],
        default: 'student'
    },
    status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String},
    phoneNumber: { type: String },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    lastLogin: { type: Date },
    avatar: { type: String },
    metadata: {
        lastPasswordChange: { type: Date },
        failedLoginAttempts: { type: Number, default: 0 },
        verifiedEmail: { type: Boolean, default: false },
        twoFactorEnabled: { type: Boolean, default: false }
    },
    permissions: [{ type: String }]
});

// Generate full name before saving
UserSchema.pre('save', function(next) {
    if (this.firstName && this.lastName) {
        this.name = `${this.firstName} ${this.lastName}`;
    }
    next();
});

// Hash password before saving to db
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);
