const ApiError = require('../utils/ApiError');

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} allowedRoles - Allowed role identifiers (e.g., 'admin', 'doctor', 'staff')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, 'Access denied: No role assigned'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' is not authorized for this resource`
        )
      );
    }

    next();
  };
};

module.exports = { authorize };
