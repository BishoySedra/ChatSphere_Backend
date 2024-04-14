import { Router } from "express";
import * as authController from "../controllers/auth.js";
import validate from "../middlewares/validator/validation.js";
import * as userSchema from "../middlewares/validator/schemas/userSchema.js";

const router = Router();

router.post(
  "/register",
  validate(userSchema.registerSchema),
  authController.register
);
router.post("/login", authController.login);

export default router;
