import { Router } from "express";
import * as chatController from "../controllers/chat.js";
import validate from "../middlewares/validator/validation.js";
import * as schemas from "../middlewares/validator/schemas/userSchema.js";
const router = Router();

router.get("/private/:email",
    validate(schemas.emailSchema, false),
    chatController.getUserPrivateChats);
router.get("/groups/:email",
    validate(schemas.emailSchema, false),
    chatController.getUserGroupChats);
router.get("/groups/details/:chatID",
    validate(schemas.chatIDSchema, false),
    chatController.getGroupChatDetails
)

router.post("/groups/create",
    validate(schemas.createGroupChatSchema),
    chatController.createGroupChat);

router.post("/groups/add-friend",
    validate(schemas.addUserToGroupChatSchema),
    chatController.addUserToGroupChat
)

router.delete("/groups/:chatID",
    validate(schemas.chatIDSchema, false),
    validate(schemas.emailSchema),
    chatController.deleteGroupChat
)

export default router;