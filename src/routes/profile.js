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

const router = Router();

router.get("/:email",
    validate(userSchema.emailSchema, false),
    userController.getUser);
router.get("/username/:email",
    validate(userSchema.emailSchema, false),
    userController.getUsernameByEmail);

router.patch("/change-username/:email",
    validate(userSchema.emailSchema, false),
    validate(userSchema.changedUsernameSchema),
    userController.changeUsernameByEmail);

router.patch("/change-image/:email",
    validate(userSchema.emailSchema, false),
    userController.changeImageByEmail);

export default router