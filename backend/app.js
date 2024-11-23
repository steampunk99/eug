// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const passport = require('passport');
require('./src/config/passport'); 
const cookieParser = require('cookie-parser');
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://school-locator.onrender.com', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
      autoRemove: 'native',
      serialize: (session) => {
        // Only serialize necessary data
        return {
          _id: session._id,
          expires: session.expires,
          session: JSON.stringify({
            cookie: session.cookie,
            userId: session.userId,
            user: session.user
          })
        };
      },
      unserialize: (session) => {
        if (session.session) {
          return {
            ...session,
            ...JSON.parse(session.session)
          };
        }
        return session;
      }
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
}));

// Add session connection error handling
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Session store is not available'));
  }
  next();
});

// Initialize passport after session
app.use(passport.initialize());
app.use(passport.session());

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increased limit
    message: {
        status: 429,
        message: 'Too many requests from this IP. Please try again in 15 minutes.',
        details: {
            remainingTime: (req) => {
                const timeLeft = req.rateLimit.resetTime - Date.now();
                return Math.ceil(timeLeft / 1000 / 60); // Returns minutes
            }
        }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        const timeLeft = req.rateLimit.resetTime - Date.now();
        const minutesLeft = Math.ceil(timeLeft / 1000 / 60);
        
        res.status(429).json({
            status: 'error',
            message: 'Too many requests from this IP',
            details: {
                minutesUntilReset: minutesLeft,
                remainingRequests: req.rateLimit.remaining,
                totalRequests: req.rateLimit.limit
            }
        });
    }
});

// More generous rate limit for school-related routes
const schoolsLimiter = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000,
    max: 200, // Higher limit for school-related operations
    message: {
        status: 429,
        message: 'Too many school-related requests. Please try again in 15 minutes.'
    }
});

// Session activity tracking middleware
app.use((req, res, next) => {
  if (req.session && req.session.user) {
      req.session.lastActive = Date.now();
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS: 30000})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', limiter, require('./src/routes/auth'));
app.use('/api/schools', schoolsLimiter, require('./src/routes/schools'));
app.use('/api/dashboard', limiter, require('./src/routes/dashboard'));
app.use('/api/staff', schoolsLimiter, require('./src/routes/staff'));
app.use('/api/enrollments', schoolsLimiter, require('./src/routes/enrollments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));