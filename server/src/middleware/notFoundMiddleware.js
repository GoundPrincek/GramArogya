const ApiError = require('../utils/ApiError');

/**
 * 404 Route Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

module.exports = notFound;
