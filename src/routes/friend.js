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
 *     examples:
 *       application/json:
 *         sender: "john.doe@example.com"
 *         receiver: "jane.doe@example.com"
 */

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
 *     examples:
 *       application/json:
 *         receiver: "jane.doe@example.com"
 *         sender: "john.doe@example.com"
 *         status: "ACCEPTED"
 */

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
 *     examples:
 *       application/json:
 *         email: "john.doe@example.com"
 */

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
 *     examples:
 *       application/json:
 *         email: "jane.doe@example.com"
 */

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
 *     examples:
 *       application/json:
 *         email: "john.doe@example.com"
 *         friendEmail: "jane.doe@example.com"
 */

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
 *     examples:
 *       application/json:
 *         sender: "john.doe@example.com"
 *         receiver: "jane.doe@example.com"
 */

const router = Router();

// search friend by email
// router.get(
//   "/search/:email",
//   validate(userSchemas.emailSchema, false),
//   FriendController.searchFriendByEmail
// );

// send friend request
router.post(
  "/:sender/send/:receiver",
  validate(userSchemas.friendRequestSchema, false),
  FriendController.sendFriendRequest
);

// accept friend request
router.post(
  "/:receiver/response/:sender",
  validate(userSchemas.friendRequestSchema, false),
  validate(userSchemas.friendRequestResponseSchema),
  FriendController.respondToFriendRequest
);

router.get(
  "/:email/friends",
  validate(userSchemas.emailSchema, false),
  FriendController.getAllFriends
);

router.get(
  "/:email/friend-requests",
  validate(userSchemas.emailSchema, false),
  FriendController.getAllFriendRequests
);

router.patch("/:email/unfriend/:friendEmail",
  validate(userSchemas.unfriendSchema, false),
  FriendController.unfriend
);

router.patch('/:sender/cancel-friend-request/:receiver',
  validate(userSchemas.friendRequestSchema, false),
  FriendController.cancelFriendRequest
)

export default router;
