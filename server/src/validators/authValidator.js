const ApiError = require('../utils/ApiError');

/**
 * Validate registration input
 */
const validateRegister = (req, res, next) => {
  const { name, phone, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  // 10-digit Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.push({ field: 'phone', message: 'Valid 10-digit Indian mobile number is required' });
  }

  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  const validRoles = ['patient', 'asha_worker', 'doctor', 'staff', 'admin'];
  if (role && !validRoles.includes(role)) {
    errors.push({ field: 'role', message: `Role must be one of: ${validRoles.join(', ')}` });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for registration', errors));
  }

  next();
};

/**
 * Validate login input
 */
const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;
  const errors = [];

  if (!identifier || identifier.trim() === '') {
    errors.push({ field: 'identifier', message: 'Mobile number or email is required' });
  }

  if (!password || password === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for login', errors));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
