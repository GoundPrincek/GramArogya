const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to verify JWT token from Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, role, phone, facilityId }
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token', [error.message]));
  }
};

module.exports = { protect };
