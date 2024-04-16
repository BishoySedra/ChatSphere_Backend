import { Router } from "express";
import * as FriendController from "../controllers/friend.js";
import validate from "../middlewares/validator/validation.js";
import * as userSchemas from "../middlewares/validator/schemas/userSchema.js";

const router = Router();

// search friend by email
router.get(
  "/search/:email",
  validate(userSchemas.emailSchema, false),
  FriendController.searchFriendByEmail
);

// send friend request
router.post(
  "/:sender/send/:receiver",
  validate(userSchemas.friendRequestSchema, false),
  FriendController.sendFriendRequest
);

// accept friend request
router.post(
  "/:sender/response/:receiver",
  validate(userSchemas.friendRequestSchema, false),
  FriendController.respondToFriendRequest
);

router.get(
  "/:email/friends",
  validate(userSchemas.emailSchema, false),
  FriendController.getAllFriends
);

export default router;
