const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerUiDist = require('swagger-ui-dist');
const swaggerSpec = require('./config/swagger');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

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

// Serve Swagger UI static assets directly with correct MIME types
const swaggerAssetPath = swaggerUiDist.getAbsoluteFSPath();
app.use('/api-docs', express.static(swaggerAssetPath));

// Swagger UI options with CDN fallbacks for serverless execution
const swaggerUiOptions = {
  explorer: true,
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.min.js'
  ]
};

// Swagger Interactive API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Auth rate limiter on auth routes
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/users', require('./routes/user.routes'));

// 404 & Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
