//make router for message
import { Router } from "express";
import * as messageController from "../controllers/message.js";
import validate from "../middlewares/validator/validation.js";
import * as schemas from "../middlewares/validator/schemas/userSchema.js";
import fileUpload from "../helpers/multer.js";

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
 *       403:
 *         description: User is not part of the chat
 *       404:
 *         description: User or chat not found
 *     examples:
 *       application/json:
 *         message: "Hello, this is a test message!"
 *         image: (binary file)
 */

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

const router = Router();

router.post("/:senderEmail/send/:chatID",
    validate(schemas.sendMessageURLSchema, false),
    validate(schemas.messageBodySchema),
    messageController.sendMessage);

router.delete("/:senderEmail/delete/:chatID/:messageID",
    validate(schemas.deleteMessageURLSchema, false),
    messageController.deleteMessage);


export default router;
