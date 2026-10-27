const { z } = require('zod');
const ApiError = require('../utils/ApiError');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number is required (e.g. 9822011223)'),
  email: z.string().trim().email('Invalid email address format').or(z.literal('')).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  preferredLanguage: z.enum(['en', 'mr', 'hi']).optional(),
  jurisdiction: z.object({
    district: z.string().optional(),
    taluka: z.string().optional(),
    village: z.string().optional()
  }).optional()
});

const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Mobile number or email is required'),
  password: z.string().min(1, 'Password is required')
});

const validateRegister = (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);
    req.body = parsed;
    // Security requirement: Public registration must create patient accounts only!
    req.body.role = 'patient';
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for registration', errors));
  }
};

const validateLogin = (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    next(new ApiError(400, 'Validation failed for login', errors));
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  registerSchema,
  loginSchema
};
