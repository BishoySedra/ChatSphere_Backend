// Import necessary modules and dependencies
import { Router } from "express";
import * as authController from "../controllers/auth.js";
import validate from "../middlewares/validator/validation.js";
import * as userSchema from "../middlewares/validator/schemas/userSchema.js";
import { authRateLimiter, strictRateLimiter } from "../middlewares/security/rateLimiter.js";
import { checkAccountLockout } from "../middlewares/security/loginAttempts.js";

// Initialize the router
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: object
 *                   description: Registered user details
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User registered successfully! Please verify your email.
 *       400:
 *         description: Bad request
 */

// Route to register a new user
router.post(
  "/register",
  authRateLimiter,                      // Apply rate limiting for auth
  validate(userSchema.registerSchema), // Validate registration details
  authController.register              // Controller to handle the logic
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: string
 *                   description: JWT token
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Unauthorized
 */

// Route to log in a user
router.post(
  "/login",
  authRateLimiter,                   // Apply rate limiting for auth
  checkAccountLockout,               // Check for account lockout
  validate(userSchema.loginSchema),  // Validate login details
  authController.login               // Controller to handle the logic
);

/**
 * @swagger
 * /auth/verify/{email}:
 *   get:
 *     summary: Verify a user's email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address to verify
 *         example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<h1>Email verified successfully!</h1>"
 *       400:
 *         description: Bad request
 */

// Route to verify a user's email
router.get(
  "/verify/:email",
  strictRateLimiter,                   // Apply strict rate limiting for verification
  validate(userSchema.emailSchema, false), // Validate email format
  authController.verifyEmail              // Controller to handle the logic
);

// Export the router to be used in the application
export default router;
