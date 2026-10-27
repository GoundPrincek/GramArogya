const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a signed JWT for authenticated sessions
 * @param {Object} payload - Object containing user identification (id, role, etc.)
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

module.exports = generateToken;
