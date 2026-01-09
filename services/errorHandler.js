/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling across the application
 */

// Error types
export const ERROR_TYPES = {
  AUTH: 'auth',
  NETWORK: 'network',
  VALIDATION: 'validation',
  FIREBASE: 'firebase',
  API: 'api',
  UNKNOWN: 'unknown',
};

// Firebase Auth error code to user-friendly message mapping
const FIREBASE_AUTH_ERRORS = {
  'auth/email-already-in-use': 'This email is already registered. Please login instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/requires-recent-login': 'For security, please logout and login again to perform this action.',
  'auth/invalid-verification-code': 'Invalid verification code. Please check and try again.',
  'auth/invalid-verification-id': 'Verification session expired. Please request a new code.',
  'auth/missing-verification-code': 'Please enter the verification code.',
  'auth/missing-phone-number': 'Please enter a valid phone number.',
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
  'auth/quota-exceeded': 'Too many requests. Please try again later.',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/popup-closed-by-user': 'Authentication cancelled. Please try again.',
  'auth/email-not-verified': 'Please verify your email before logging in.',
};

// Firestore error code to user-friendly message mapping
const FIRESTORE_ERRORS = {
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested data was not found.',
  'already-exists': 'This data already exists.',
  'failed-precondition': 'Operation cannot be performed in the current state.',
  'aborted': 'Operation was aborted. Please try again.',
  'out-of-range': 'Invalid input range.',
  'unauthenticated': 'Please login to continue.',
  'resource-exhausted': 'Quota exceeded. Please try again later.',
  'data-loss': 'Data corruption detected. Please contact support.',
  'unavailable': 'Service temporarily unavailable. Please try again.',
  'deadline-exceeded': 'Operation timed out. Please try again.',
};

// Network error messages
const NETWORK_ERRORS = {
  offline: 'You appear to be offline. Please check your internet connection.',
  timeout: 'Request timed out. Please try again.',
  'network-error': 'Network error occurred. Please check your connection and try again.',
};

/**
 * Extract error code from Firebase error
 */
function getErrorCode(error) {
  if (!error) return null;
  
  // Firebase errors have a code property
  if (error.code) return error.code;
  
  // Some errors have it nested in customData
  if (error.customData?.code) return error.customData.code;
  
  return null;
}

/**
 * Get error type from error object
 */
export function getErrorType(error) {
  if (!error) return ERROR_TYPES.UNKNOWN;
  
  const code = getErrorCode(error);
  
  if (code) {
    if (code.startsWith('auth/')) return ERROR_TYPES.AUTH;
    if (code === 'permission-denied' || code === 'unauthenticated') return ERROR_TYPES.FIREBASE;
  }
  
  if (error.message) {
    const msg = error.message.toLowerCase();
    if (msg.includes('network') || msg.includes('offline') || msg.includes('timeout')) {
      return ERROR_TYPES.NETWORK;
    }
    if (msg.includes('validation') || msg.includes('invalid') || msg.includes('required')) {
      return ERROR_TYPES.VALIDATION;
    }
  }
  
  if (error.name === 'NetworkError' || error.name === 'TypeError') {
    return ERROR_TYPES.NETWORK;
  }
  
  return ERROR_TYPES.UNKNOWN;
}

/**
 * Convert error to user-friendly message
 */
export function getUserFriendlyMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  // If error is already a string, return it
  if (typeof error === 'string') return error;
  
  // Get error code
  const code = getErrorCode(error);
  
  // Check Firebase Auth errors
  if (code && FIREBASE_AUTH_ERRORS[code]) {
    return FIREBASE_AUTH_ERRORS[code];
  }
  
  // Check Firestore errors
  if (code && FIRESTORE_ERRORS[code]) {
    return FIRESTORE_ERRORS[code];
  }
  
  // Check network errors
  if (error.message) {
    const msg = error.message.toLowerCase();
    if (msg.includes('offline')) return NETWORK_ERRORS.offline;
    if (msg.includes('timeout')) return NETWORK_ERRORS.timeout;
    if (msg.includes('network')) return NETWORK_ERRORS['network-error'];
  }
  
  // Check if error has a user-friendly message property
  if (error.userMessage) return error.userMessage;
  
  // Return error message if it looks user-friendly (not too technical)
  if (error.message && !error.message.includes('undefined') && error.message.length < 100) {
    return error.message;
  }
  
  // Default fallback message
  return 'Something went wrong. Please try again or contact support if the issue persists.';
}

/**
 * Log error to console with context
 */
export function logError(error, context = {}) {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    code: getErrorCode(error),
    type: getErrorType(error),
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
  };
  
  console.error('❌ Error:', errorInfo);
  
  // In production, you could send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
  
  return errorInfo;
}

/**
 * Main error handler - Use this in try-catch blocks
 * @param {Error} error - The error object
 * @param {Object} context - Additional context about where the error occurred
 * @param {Function} notificationCallback - Optional callback to show user notification
 * @returns {Object} - Standardized error response
 */
export function handleError(error, context = {}, notificationCallback = null) {
  // Log the error
  const errorInfo = logError(error, context);
  
  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(error);
  
  // Show notification if callback provided
  if (notificationCallback && typeof notificationCallback === 'function') {
    notificationCallback(userMessage, 'error');
  }
  
  // Return standardized error response
  return {
    success: false,
    error: userMessage,
    errorType: errorInfo.type,
    errorCode: errorInfo.code,
    timestamp: errorInfo.timestamp,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhoneNumber(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits (Indian mobile) or 12 digits (with country code)
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  
  // Optional: Add more strength requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  
  return { valid: true, message: 'Password is valid.' };
}

/**
 * Wrap async function with error handling
 * Usage: const safeFunction = withErrorHandling(asyncFunction, context, notificationCallback);
 */
export function withErrorHandling(fn, context = {}, notificationCallback = null) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error, context, notificationCallback);
    }
  };
}

/**
 * Check if user is online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Wait for network connection
 */
export function waitForOnline(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      resolve(true);
      return;
    }
    
    const timer = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      reject(new Error('Network timeout'));
    }, timeout);
    
    const onlineHandler = () => {
      clearTimeout(timer);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };
    
    window.addEventListener('online', onlineHandler);
  });
}

export default {
  ERROR_TYPES,
  handleError,
  getUserFriendlyMessage,
  logError,
  getErrorType,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  withErrorHandling,
  isOnline,
  waitForOnline,
};
