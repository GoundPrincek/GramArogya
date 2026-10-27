const config = require('../config/env');

/**
 * Centralized Express Error Handling Middleware
 * Ensures consistent JSON error response format across all routes
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Value already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors && errors.length > 0 ? errors : undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
