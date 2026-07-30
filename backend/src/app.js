const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API Server is healthy' });
});

// Auth rate limiter on auth routes
app.use('/api/auth', authLimiter);

// API Routes placeholder (will be attached in subsequent phases)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/users', require('./routes/user.routes'));

// 404 & Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
