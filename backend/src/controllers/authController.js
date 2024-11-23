const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role'); // Assuming Role model is defined in a separate file
const Activity = require('../models/Activity'); // Assuming Activity model is defined in a separate file

// Constants
const SALT_ROUNDS = 10;

// Helper function for error responses
const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

// register
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
    
        // Input validation
        if (!email || !password || !firstName || !lastName) {
            return sendError(res, 400, 'All fields are required');
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, 'Invalid email format');
        }

        // Check if user exists (both email and username)
        const existingUser = await User.findOne({ 
            $or: [{ email }] 
        });
        
        if (existingUser) {
            return sendError(res, 400, 
                existingUser.email === email ? 'Email already registered' : 'Username already taken'
            );
        }
      

        // Get the student role
        const studentRole = await Role.findOne({ value: 'student' });
        if (!studentRole) {
            return sendError(res, 500, 'Default role not found');
        }

        const [name] = [firstName, lastName].filter(Boolean);
        // Create new user
        const user = new User({ 
            email, 
            password, 
            name, 
            role: studentRole.value // Use the role value from the Role model
        });

        await user.save();

    //    set session
    req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role     
    }
    req.session.save((err)=>{
        if (err) {
            return sendError(res, 500, 'Server error during registration, bad session');
        }
        return res.status(201).json({success: true, message: 'Registration successful'});
    })
    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 500, 'Server error during registration');
    }
};

// login
exports.login = async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email);
        const { email, password } = req.body;
       
        // Input validation
        if (!email || !password) {
            console.log('Login failed: Missing email or password');
            return sendError(res, 400, 'Email and password are required');
        }

        // Check if user exists and explicitly include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('Login failed: User not found for email:', email);
            return sendError(res, 401, 'Invalid credentials');
        }

        // Add validation to ensure password exists in database
        if (!user.password) {
            console.error('Login failed: Password missing in database for user:', email);
            return sendError(res, 500, 'Account error, please contact support');
        }

        // Check password
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Login failed: Invalid password for user:', email);
                return sendError(res, 401, 'Invalid credentials');
            }
        } catch (bcryptError) {
            console.error('Password comparison error:', bcryptError);
            return sendError(res, 500, 'Error validating credentials');
        }

        // Create session with minimal data
        const userResponse = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        req.session.userId = user._id;
        req.session.user = userResponse;
        
        // Save session and handle response
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return sendError(res, 500, 'Server error during login');
            }

            console.log('Login successful for user:', email);
            
            // Log login activity after successful session save
            Activity.create({
                user: user._id,
                performedBy: user._id,
                action: 'login',
                details: 'User logged in successfully',
                metadata: {
                    email: user.email,
                    timestamp: new Date()
                }
            }).catch(error => {
                console.error('Activity log error:', error);
            });

            return res.status(200).json({
                success: true, 
                message: 'Login successful',
                user: userResponse
            });
        });

    } catch (error) {
        console.error('Login error details:', error);
        return sendError(res, 500, `Server error during login: ${error.message}`);
    }
};

// logout 
exports.logout = async (req, res) => {
    try {
        const userId = req.session?.user?.id || req.user?._id;
        
        if (userId) {
            // Log logout activity
            await Activity.create({
                user: userId,
                performedBy: userId,
                action: 'logout',
                details: 'User logged out successfully'
            });
        }

        // Properly destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return sendError(res, 500, 'Error during logout');
            }
            
            // Clear all auth-related cookies
            res.clearCookie('sessionId', {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    } catch (error) {
        console.error('Logout error:', error);
        return sendError(res, 500, 'Server error during logout');
    }
};

// New method to get current user
exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authenticated' 
            });
        }

        const user = await User.findById(req.session.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return sendError(res, 500, 'Server error');
    }
};


exports.googleCallback = async (req, res) => {
    try {
        if (!req.user) {
            throw new Error('No user data from Google authentication');
        }
        // Set user session
        req.session.user = {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        };

        // Save session
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                throw new Error('Error creating session');
            }

            const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendURL}/auth/google/success`);
        });
    } catch (error) {
        console.error('Google callback error:', error);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendURL}/auth/google/error`);
    }
};