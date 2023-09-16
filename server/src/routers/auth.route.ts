import { validate } from "../middlewares/validate.middleware";
import UserController from "../controllers/user.controller";
import { userSchema } from "../yup/schemas/user.schema";
import { Router } from "express";
import { tokenSchema } from "../yup/schemas/token.schema";

const router = Router();

router.post("/add", validate(userSchema), UserController.addUser);

router.post("/verify-email", validate(tokenSchema), UserController.sendVerificationToken);

router.post("/re-verify-email", UserController.resendVerificationToken);

router.post("/forgot-password", UserController.forgotPassword);

export default router;
