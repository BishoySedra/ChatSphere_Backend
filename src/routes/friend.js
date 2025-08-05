// Import necessary modules and dependencies
import { Router } from "express";
import * as FriendController from "../controllers/friend.js";
import validate from "../middlewares/validator/validation.js";
import { authorize } from "../middlewares/validator/authorize.js";
import * as userSchemas from "../middlewares/validator/schemas/userSchema.js";

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: API for managing friends and friend requests
 */

// Initialize the router
const router = Router();

/**
 * @swagger
 * /friends/{sender}/send/{receiver}:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: sender
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the sender
 *       - in: path
 *         name: receiver
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the receiver
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Validation error or friend request already exists
 *       404:
 *         description: User not found
 */

// Route to send a friend request
router.post(
  "/:sender/send/:receiver",
  validate(userSchemas.friendRequestSchema, false), // Validate sender and receiver emails
  FriendController.sendFriendRequest                // Controller to handle the logic
);

/**
 * @swagger
 * /friends/{receiver}/response/{sender}:
 *   post:
 *     summary: Respond to a friend request
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: receiver
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the receiver
 *       - in: path
 *         name: sender
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the sender
 *       - in: body
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ACCEPTED, REJECTED]
 *         description: Response status
 *     responses:
 *       200:
 *         description: Friend request accepted or rejected
 *       404:
 *         description: Friend request not found
 */

// Route to respond to a friend request
router.post(
  "/:receiver/response/:sender",
  validate(userSchemas.friendRequestSchema, false),       // Validate receiver and sender emails
  validate(userSchemas.friendRequestResponseSchema),      // Validate response status
  FriendController.respondToFriendRequest                // Controller to handle the logic
);

/**
 * @swagger
 * /friends/{email}/friends:
 *   get:
 *     summary: Get all friends of a user
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: List of friends
 *       404:
 *         description: User not found
 */

// Route to get all friends of a user
router.get(
  "/:email/friends",
  validate(userSchemas.emailSchema, false), // Validate user email
  FriendController.getAllFriends           // Controller to handle the logic
);

/**
 * @swagger
 * /friends/{email}/friend-requests:
 *   get:
 *     summary: Get all friend requests for a user
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: List of friend requests
 *       404:
 *         description: User not found
 */

// Route to get all friend requests for a user
router.get(
  "/:email/friend-requests",
  validate(userSchemas.emailSchema, false), // Validate user email
  FriendController.getAllFriendRequests    // Controller to handle the logic
);

/**
 * @swagger
 * /friends/{email}/unfriend/{friendEmail}:
 *   patch:
 *     summary: Unfriend a user
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *       - in: path
 *         name: friendEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the friend to unfriend
 *     responses:
 *       200:
 *         description: Successfully unfriended
 *       404:
 *         description: User or friend not found
 */

// Route to unfriend a user
router.patch(
  "/:email/unfriend/:friendEmail",
  validate(userSchemas.unfriendSchema, false), // Validate user and friend emails
  FriendController.unfriend                   // Controller to handle the logic
);

/**
 * @swagger
 * /friends/{sender}/cancel-friend-request/{receiver}:
 *   patch:
 *     summary: Cancel a sent friend request
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: sender
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the sender
 *       - in: path
 *         name: receiver
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the receiver
 *     responses:
 *       200:
 *         description: Friend request cancelled successfully
 *       404:
 *         description: Friend request not found
 */

// Route to cancel a sent friend request
router.patch(
  "/:sender/cancel-friend-request/:receiver",
  validate(userSchemas.friendRequestSchema, false), // Validate sender and receiver emails
  FriendController.cancelFriendRequest             // Controller to handle the logic
);

// Export the router to be used in the application
export default router;
