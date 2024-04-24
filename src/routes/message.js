//make router for message
import { Router } from "express";
import { messageController } from "../controllers/messageController.js";

const router = Router();

router.get("/:senderEmail/send/:chatID", messageController.sendMessage);
router.get("/:senderEmail/delete/:chatID", messageController.deleteMessage);


export default router;