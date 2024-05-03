//make router for message
import { Router } from "express";
import * as messageController  from "../controllers/message.js";
import validate from "../middlewares/validator/validation.js";
import * as schemas from "../middlewares/validator/schemas/userSchema.js";


const router = Router();

router.post("/:senderEmail/send/:chatID",
    validate(schemas.sendMessageURLSchema, false),
    validate(schemas.messageBodySchema),
    messageController.sendMessage);

router.delete("/:senderEmail/delete/:chatID/:messageID", 
    validate(schemas.deleteMessageURLSchema, false),
    messageController.deleteMessage);


export default router;