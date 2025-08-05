// Import necessary modules and dependencies
import { Router } from "express";
import * as userController from "../controllers/profile.js";
import validate from "../middlewares/validator/validation.js";
import * as userSchema from "../middlewares/validator/schemas/userSchema.js";

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * /profile/{email}:
 *   get:
 *     summary: Get user details by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 123
 *               email: user@example.com
 *               username: user123
 *       400:
 *         description: Invalid email format
 *       404:
 *         description: User not found
 */

// Initialize the router
const router = Router();

// Route to get user details by email
router.get(
    "/:email",
    validate(userSchema.emailSchema, false), // Validate email format
    userController.getUser                  // Controller to handle the logic
);

/**
 * @swagger
 * /profile/username/{email}:
 *   get:
 *     summary: Get username by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Username retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               username: user123
 *       400:
 *         description: Invalid email format
 *       404:
 *         description: User not found
 */

// Route to get username by email
router.get(
    "/username/:email",
    validate(userSchema.emailSchema, false), // Validate email format
    userController.getUsernameByEmail       // Controller to handle the logic
);

/**
 * @swagger
 * /profile/change-username/{email}:
 *   patch:
 *     summary: Change username by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *       - in: body
 *         name: username
 *         description: New username to be set
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: newUsername123
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Username updated successfully
 *       400:
 *         description: Invalid email or username format
 *       404:
 *         description: User not found
 */

// Route to change username by email
router.patch(
    "/change-username/:email",
    validate(userSchema.emailSchema, false),       // Validate email format
    validate(userSchema.changedUsernameSchema),   // Validate new username
    userController.changeUsernameByEmail          // Controller to handle the logic
);

/**
 * @swagger
 * /profile/change-image/{email}:
 *   patch:
 *     summary: Change profile image by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *       - in: body
 *         name: image
 *         description: New profile image URL to be set
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *               example: https://example.com/images/profile.jpg
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Profile image updated successfully
 *       400:
 *         description: Invalid email or image URL format
 *       404:
 *         description: User not found
 */

// Route to change profile image by email
router.patch(
    "/change-image/:email",
    validate(userSchema.emailSchema, false), // Validate email format
    userController.changeImageByEmail       // Controller to handle the logic
);

// Export the router to be used in the application
export default router;