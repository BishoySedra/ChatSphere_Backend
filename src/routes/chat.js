import { Router } from "express";
import { chatController } from "../controllers/chatController.js";

const router = Router();

router.get("/private/:email", chatController.getUserPrivateChats);
router.get("/groups/:email", chatController.getUserGroupChats);

export default router;