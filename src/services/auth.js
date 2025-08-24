import { createCustomError } from "../middlewares/errors/customError.js";
import * as bcrypt from "../helpers/bcrypt.js";
import * as jwt from "../helpers/jwt.js";
import User from "../db/models/user.js";
import sendEmail from "../helpers/emailSending.js";
import dotenv from "dotenv";
import { uploadFile } from "./message.js";
import { recordFailedAttempt, clearFailedAttempts } from "../middlewares/security/loginAttempts.js";
import { sanitizeInput } from "../middlewares/security/sanitizer.js";

dotenv.config();

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {Buffer} imageBuffer - Optional profile image buffer
 * @param {string} domain - Domain for verification link
 * @param {string} protocol - Protocol for verification link (http/https)
 * @throws {CustomError} - If user already exists
 * @returns {Promise<{username: string, email: string}>} - User details
 */
export const registerService = async (userData, imageBuffer, domain, protocol) => {
  const { username, email, password } = userData;

  // Check if the user already exists
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new createCustomError("User already exists", 409, null);
  }

  const hashedPassword = await bcrypt.hashPassword(password);

  // Upload profile image if provided
  let image_url = null;
  if (imageBuffer) {
    const result = await uploadFile(imageBuffer);
    image_url = result.secure_url;
  }

  // Create and save new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    image_url,
    friends: [],
  });

  await user.save();

  // Send verification email
  const verificationLink = `${protocol}://${domain}${process.env.BASE_URL}/auth/verify/${email}`;
  const subject = "Account Verification";
  const text = `Click the button below to verify your account:`;
  const html = `
    <h1>Account Verification</h1>
    <p>Click the button below to verify your account:</p>
    <a href="${verificationLink}">
      <button>Verify Account</button>
    </a>
  `;

  await sendEmail(email, subject, text, html);

  return { username, email };
};

/**
 * Authenticate user login
 * @param {Object} userData - User login data
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} clientIp - Client IP address for tracking failed attempts
 * @throws {CustomError} - If user not found, not verified, or invalid password
 * @returns {Promise<string>} - JWT token
 */
export const loginService = async (userData, clientIp = null) => {
  const { email, password } = userData;

  try {
    // Check if user exists
    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      if (clientIp) recordFailedAttempt(clientIp, email);
      throw new createCustomError("Invalid credentials!", 401, null);
    }

    // Check if account is verified
    if (!existedUser.isVerified) {
      if (clientIp) recordFailedAttempt(clientIp, email);
      throw new createCustomError("Account is not verified!", 401, null);
    }

    // Verify password
    const isCorrectPassword = await bcrypt.comparePassword(
      password,
      existedUser.password
    );

    if (!isCorrectPassword) {
      if (clientIp) recordFailedAttempt(clientIp, email);
      throw new createCustomError("Invalid credentials!", 401, null);
    }

    // Clear failed attempts on successful login
    if (clientIp) clearFailedAttempts(clientIp, email);

    // Generate JWT token
    const token = jwt.generateToken([
      {
        email: existedUser.email,
      },
      {
        id: existedUser._id,
      },
    ]);

    return token;
  } catch (error) {
    // Record failed attempt for any login error
    if (clientIp && error.statusCode === 401) {
      recordFailedAttempt(clientIp, email);
    }
    throw error;
  }
};

/**
 * Verify user email
 * @param {string} email - User's email to verify
 * @throws {CustomError} - If email not found
 * @returns {Promise<void>}
 */
export const verifyEmailService = async (email) => {
  // Check if user exists
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new createCustomError("Email Not Found!", 404, null);
  }

  // Mark user as verified
  existedUser.isVerified = true;
  await existedUser.save();
};
