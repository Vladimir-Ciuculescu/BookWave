import { validate } from "../middlewares/validate.middleware";
import UserController from "../controllers/user.controller";
import { userSchema } from "../yup/schemas/user.schema";
import { Router } from "express";

const router = Router();

router.post("/add", validate(userSchema), UserController.addUser);

router.post("/verify", UserController.verifyEmail);

export default router;
