/**
 * Higher-order wrapper to catch async errors and forward to errorMiddleware
 * @param {Function} fn - Express route handler function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
