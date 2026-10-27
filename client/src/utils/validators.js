/**
 * Validate 10-digit Indian Mobile Number
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * Validate email address format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};
