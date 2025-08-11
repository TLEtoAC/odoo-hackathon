const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const { testConnection } = require('./db');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const integrationsRoutes = require('./routes/integrationsRoutes');

const app = express();
const PORT = process.env.PORT || 8000;
const USE_MOCKS = (process.env.USE_MOCKS || 'false').toLowerCase() === 'true';

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, sameSite: 'lax', maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000 }
}));

// TODO: Re-enable PostgreSQL session store after DB connection is fixed
// store: new pgSession({
//   conString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
//   createTableIfMissing: true
// })

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'GlobeTrotter API is running', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development' });
});

// API routes
if (USE_MOCKS) {
  const mockRoutes = require('./routes/mockRoutes');
  app.use('/api', mockRoutes);
} else {
  app.use('/api/auth', userRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/explore', exploreRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/itinerary', itineraryRoutes);
  app.use('/api/budget', budgetRoutes);
}
app.use('/api/integrations', integrationsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors.map(err => ({ field: err.path, message: err.message, value: err.value })) });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ success: false, message: 'Duplicate entry', errors: error.errors.map(err => ({ field: err.path, message: `${err.path} already exists`, value: err.value })) });
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    if (!USE_MOCKS) {
      // Only verify DB connectivity; do not create/alter tables here
      await testConnection();
      console.log('✅ Database connection OK (no schema sync)');
    }

    app.listen(PORT, () => {
      console.log(`🚀 GlobeTrotter API server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️ Database: ${USE_MOCKS ? 'Mocks enabled' : 'External schema (managed in PGAdmin)'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => { console.log('SIGTERM received, shutting down gracefully'); process.exit(0); });
process.on('SIGINT', () => { console.log('SIGINT received, shutting down gracefully'); process.exit(0); });

startServer();
