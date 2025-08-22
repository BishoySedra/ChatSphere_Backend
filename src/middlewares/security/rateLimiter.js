import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints to prevent brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    message: 'Too many authentication attempts from this IP, please try again later.',
    status: 429,
    body: null
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests
  skipSuccessfulRequests: true,
});

/**
 * General rate limiter for API endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later.',
    status: 429,
    body: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for password reset and sensitive operations
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour for sensitive operations
  message: {
    message: 'Too many sensitive operation attempts from this IP, please try again later.',
    status: 429,
    body: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});