/**
 * Format ISO date string into readable local format
 * @param {string|Date} dateString
 * @param {string} locale
 * @returns {string}
 */
export const formatDate = (dateString, locale = 'en-IN') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format timestamp into readable time string
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
