// Import necessary modules and dependencies
import { Router } from "express";
import * as chatController from "../controllers/chat.js";
import validate from "../middlewares/validator/validation.js";
import * as schemas from "../middlewares/validator/schemas/userSchema.js";

// Initialize the router
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management endpoints
 */

/**
 * @swagger
 * /private/{email}:
 *   get:
 *     summary: Retrieve private chats of a user
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved private chats
 *         content:
 *           application/json:
 *             example:
 *               message: "Private chats of user retrieved successfully!"
 *               status: 200
 *               body: [{ "_id": "chatId1", "users": ["user1@example.com", "user2@example.com"], "chat_type": "PRIVATE" }]
 *       404:
 *         description: User not found
 */

// Route to retrieve private chats of a user
router.get(
    "/private/:email",
    validate(schemas.emailSchema, false), // Validate email format
    chatController.getUserPrivateChats    // Controller to handle the logic
);

/**
 * @swagger
 * /groups/{email}:
 *   get:
 *     summary: Retrieve group chats of a user
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved group chats
 *         content:
 *           application/json:
 *             example:
 *               message: "Group chats of user retrieved successfully!"
 *               status: 200
 *               body: [{ "_id": "groupId1", "users": ["user1@example.com"], "chat_type": "GROUP", "groupChatDetails": { "group_name": "Group 1", "admin_email": "admin@example.com" } }]
 *       404:
 *         description: User not found
 */

// Route to retrieve group chats of a user
router.get(
    "/groups/:email",
    validate(schemas.emailSchema, false), // Validate email format
    chatController.getUserGroupChats      // Controller to handle the logic
);

/**
 * @swagger
 * /groups/details/{chatID}:
 *   get:
 *     summary: Retrieve details of a group chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group chat
 *     responses:
 *       200:
 *         description: Successfully retrieved group chat details
 *         content:
 *           application/json:
 *             example:
 *               message: "Group chat details retrieved successfully!"
 *               status: 200
 *               body: { "group_name": "Group 1", "admin_email": "admin@example.com" }
 *       404:
 *         description: Group chat not found
 */

// Route to retrieve details of a group chat
router.get(
    "/groups/details/:chatID",
    validate(schemas.chatIDSchema, false), // Validate chat ID format
    chatController.getGroupChatDetails     // Controller to handle the logic
);

/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create a new group chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminEmail:
 *                 type: string
 *               groupName:
 *                 type: string
 *               groupDescription:
 *                 type: string
 *           example:
 *             adminEmail: "admin@example.com"
 *             groupName: "Group 1"
 *             groupDescription: "This is a test group"
 *     responses:
 *       200:
 *         description: Successfully created group chat
 *         content:
 *           application/json:
 *             example:
 *               body: "groupId1"
 *               message: "Group chat created successfully!"
 *               status: 200
 *       404:
 *         description: Admin user not found
 */

// Route to create a new group chat
router.post(
    "/groups/create",
    validate(schemas.createGroupChatSchema), // Validate group creation details
    chatController.createGroupChat           // Controller to handle the logic
);

/**
 * @swagger
 * /groups/add-friend:
 *   post:
 *     summary: Add a user to a group chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminEmail:
 *                 type: string
 *               userEmail:
 *                 type: string
 *               chatID:
 *                 type: string
 *           example:
 *             adminEmail: "admin@example.com"
 *             userEmail: "user@example.com"
 *             chatID: "groupId1"
 *     responses:
 *       200:
 *         description: Successfully added user to group chat
 *         content:
 *           application/json:
 *             example:
 *               body: null
 *               message: "User added to group chat successfully!"
 *               status: 200
 *       404:
 *         description: User or admin not found
 *       400:
 *         description: User is not a friend of the admin
 */

// Route to add a user to a group chat
router.post(
    "/groups/add-friend",
    validate(schemas.addUserToGroupChatSchema), // Validate user addition details
    chatController.addUserToGroupChat          // Controller to handle the logic
);

/**
 * @swagger
 * /groups/{chatID}:
 *   delete:
 *     summary: Delete a group chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *           example:
 *             email: "admin@example.com"
 *     responses:
 *       200:
 *         description: Successfully deleted group chat
 *         content:
 *           application/json:
 *             example:
 *               body: null
 *               message: "Group chat deleted successfully!"
 *               status: 200
 *       404:
 *         description: Chat or admin not found
 *       403:
 *         description: User is not the admin of the group chat
 */

// Route to delete a group chat
router.delete(
    "/groups/:chatID",
    validate(schemas.chatIDSchema, false), // Validate chat ID format
    validate(schemas.emailSchema),        // Validate admin email
    chatController.deleteGroupChat        // Controller to handle the logic
);

// Route to update typing status
router.patch(
    "/typing-status",
    validate(schemas.typingStatusSchema), // Validate typing status details
    chatController.updateTypingStatus     // Controller to handle the logic
);

// Export the router to be used in the application
export default router;