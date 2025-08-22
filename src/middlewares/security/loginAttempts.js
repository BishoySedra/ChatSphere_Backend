import { createCustomError } from "../errors/customError.js";

/**
 * Track failed login attempts per IP and email
 */
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Get attempt key for tracking
 * @param {string} ip - Client IP address
 * @param {string} email - User email
 * @returns {string} - Unique key for tracking attempts
 */
const getAttemptKey = (ip, email) => `${ip}:${email}`;

/**
 * Check if account/IP is locked due to too many failed attempts
 * @param {string} ip - Client IP address
 * @param {string} email - User email
 * @returns {boolean} - True if locked, false otherwise
 */
export const isLocked = (ip, email) => {
  const key = getAttemptKey(ip, email);
  const attempts = loginAttempts.get(key);
  
  if (!attempts) return false;
  
  const now = Date.now();
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    // Lockout period has expired, clear attempts
    loginAttempts.delete(key);
    return false;
  }
  
  return attempts.count >= MAX_ATTEMPTS;
};

/**
 * Record a failed login attempt
 * @param {string} ip - Client IP address
 * @param {string} email - User email
 */
export const recordFailedAttempt = (ip, email) => {
  const key = getAttemptKey(ip, email);
  const now = Date.now();
  const attempts = loginAttempts.get(key);
  
  if (!attempts) {
    loginAttempts.set(key, { count: 1, lastAttempt: now });
  } else {
    // If more than lockout time has passed, reset count
    if (now - attempts.lastAttempt > LOCKOUT_TIME) {
      attempts.count = 1;
    } else {
      attempts.count++;
    }
    attempts.lastAttempt = now;
  }
};

/**
 * Clear failed attempts for successful login
 * @param {string} ip - Client IP address
 * @param {string} email - User email
 */
export const clearFailedAttempts = (ip, email) => {
  const key = getAttemptKey(ip, email);
  loginAttempts.delete(key);
};

/**
 * Middleware to check for account lockout
 */
export const checkAccountLockout = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const email = req.body.email;
  
  if (!email) {
    return next();
  }
  
  if (isLocked(ip, email)) {
    const remainingTime = Math.ceil(LOCKOUT_TIME / 60000); // Convert to minutes
    throw new createCustomError(
      `Account temporarily locked due to too many failed login attempts. Please try again in ${remainingTime} minutes.`,
      429,
      null
    );
  }
  
  next();
};