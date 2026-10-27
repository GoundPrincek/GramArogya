const config = require('../config/env');

/**
 * Centralized Express Error Handling Middleware
 * Ensures consistent JSON error response format
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
