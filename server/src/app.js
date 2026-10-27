const express = require('express');
const cors = require('cors');
const config = require('./config/env');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const referralRoutes = require('./routes/referralRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import Error Middleware
const notFound = require('./middleware/notFoundMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Enable CORS with configured client origin
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check Endpoint
 * Available without database connection for load balancers & monitoring
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GramArogya Connect API is operational',
    data: {
      status: 'healthy',
      service: 'GramArogyaConnect-Backend',
      uptime: process.uptime(),
      environment: config.nodeEnv,
      timestamp: new Date().toISOString()
    }
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback 404 Handler
app.use(notFound);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
