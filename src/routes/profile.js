import { Router } from "express";
import * as userController from "../controllers/profile.js";
import validate from "../middlewares/validator/validation.js";
import * as userSchema from "../middlewares/validator/schemas/userSchema.js";
import { authorize } from "../middlewares/validator/authorize.js";

const router = Router();

router.get("/:email",
    validate(userSchema.emailSchema,false),
    userController.getUser);
    
router.patch("/change-username/:email",
    validate(userSchema.emailSchema,false),
    validate(userSchema.changedUsernameSchema),
    userController.changeUsernameByEmail);



export default router