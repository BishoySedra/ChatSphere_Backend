// Import necessary modules and dependencies
import { Router } from "express";
import * as messageController from "../controllers/message.js";
import validate from "../middlewares/validator/validation.js";
import * as schemas from "../middlewares/validator/schemas/userSchema.js";

// Initialize the router
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages in chats
 */

/**
 * @swagger
 * /:senderEmail/send/:chatID:
 *   post:
 *     summary: Send a message to a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: senderEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the sender
 *       - in: path
 *         name: chatID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The text of the message
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to send with the message
 *               is_reply:
 *                 type: boolean
 *                 description: Whether the message is a reply
 *               reply_to:
 *                 type: string
 *                 description: ID of the message being replied to (if any)
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the sent message
 *                 text:
 *                   type: string
 *                   description: The text of the message
 *                 sender_email:
 *                   type: string
 *                   description: Email of the sender
 *                 imageUrl:
 *                   type: string
 *                   description: URL of the uploaded image (if any)
 *                 is_reply:
 *                   type: boolean
 *                   description: Whether the message is a reply
 *                 reply_to:
 *                   type: string
 *                   description: ID of the message being replied to (if any)
 *                 reply_to_text:
 *                   type: object
 *                   description: Text and image URL of the replied-to message
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: Text of the replied-to message
 *                     imageUrl:
 *                       type: string
 *                       description: Image URL of the replied-to message (if any)
 *       403:
 *         description: User is not part of the chat
 *       404:
 *         description: User or chat not found
 *     examples:
 *       application/json:
 *         message: "Hello, this is a test message!"
 *         image: (binary file)
 */

// Route to handle sending a message
router.post(
    "/:senderEmail/send/:chatID",
    validate(schemas.sendMessageURLSchema, false), // Validate URL parameters
    validate(schemas.messageBodySchema),          // Validate request body
    messageController.sendMessage                 // Controller to handle the logic
);

/**
 * @swagger
 * /:senderEmail/delete/:chatID/:messageID:
 *   delete:
 *     summary: Delete a message from a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: senderEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the sender
 *       - in: path
 *         name: chatID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chat
 *       - in: path
 *         name: messageID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       403:
 *         description: User is not allowed to delete the message
 *       404:
 *         description: User, chat, or message not found
 *     examples:
 *       application/json:
 *         message: "Message deleted successfully"
 */

// Route to handle deleting a message
router.delete(
    "/:senderEmail/delete/:chatID/:messageID",
    validate(schemas.deleteMessageURLSchema, false), // Validate URL parameters
    messageController.deleteMessage                  // Controller to handle the logic
);

/**
 * @swagger
 * /mark-as-seen/{email}/{chatID}/{messageID}:
 *   patch:
 *     summary: Mark a message as seen in a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user marking the message as seen
 *       - in: path
 *         name: chatID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chat containing the message
 *       - in: path
 *         name: messageID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the message to mark as seen
 *     responses:
 *       200:
 *         description: Message marked as seen successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatID:
 *                   type: string
 *                   description: ID of the chat
 *                 messageID:
 *                   type: string
 *                   description: ID of the message marked as seen
 *                 seenBy:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of users who have seen the message
 *       404:
 *         description: Chat or message not found
 *       400:
 *         description: Invalid input
 */

// Route to handle marking a message as seen
router.patch(
    "/mark-as-seen/:email/:chatID/:messageID",
    validate(schemas.markMessageAsSeenURLSchema, false), // Validate URL parameters
    messageController.markMessageAsSeen                 // Controller to handle the logic
);

// Export the router to be used in the application
export default router;
