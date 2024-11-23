// src/routes/auth.js
const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController');
const passport = require('passport');
const { authenticateSession } = require('../middleware/auth');

// only checking if user is NOT authenticated
const isNotAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.status(403).json({ message: 'Already authenticated' });
    }
    next();
};

// Local authentication routes
router.post('/register', 
    isNotAuthenticated,
    authController.register
);

router.post('/login', 
    isNotAuthenticated,
    passport.authenticate('local'), 
    authController.login
);

router.post('/logout', 
    authenticateSession,
    authController.logout
);

// Google authentication routes
router.get('/google',
    isNotAuthenticated,
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        failureMessage: true
    }),
    authController.googleCallback
);

// Get current user
router.get('/session',
    authenticateSession,
    authController.getCurrentUser
);

module.exports = router;