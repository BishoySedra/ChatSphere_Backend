import { Router } from "express";
import * as chatController from "../controllers/chat.js";

const router = Router();

router.get("/private/:email", chatController.getUserPrivateChats);
router.get("/groups/:email", chatController.getUserGroupChats);

export default router;