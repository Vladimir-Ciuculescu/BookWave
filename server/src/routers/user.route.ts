import { validateMiddleware } from "../middlewares/validate.middleware";
import UserController from "../controllers/user.controller";
import { userSchema, changePasswordSchema, signInSchema, passwordResetTokenSchem, tokenSchema } from "../yup/user.schemas";
import { Router, Response } from "express";
import { validateTokenMiddleware } from "../middlewares/validate-token.middleware";
import { isAuthenticatedMiddleware } from "../middlewares/is-authenticated.middleware";
import { fileParserMiddleware } from "../middlewares/file-parser.middleware";

const router: any = Router();

router.post("/add", validateMiddleware(userSchema), UserController.addUser);

router.post("/verify-email", validateMiddleware(tokenSchema), UserController.sendVerificationToken);

router.post("/re-verify-email", UserController.resendVerificationToken);

router.post("/forgot-password", UserController.forgotPassword);

router.post(
  "/verify-password-reset-token",
  validateMiddleware(passwordResetTokenSchem),
  validateTokenMiddleware(),
  UserController.verifyPasswordResetToken,
);

router.post("/change-password", validateMiddleware(changePasswordSchema), UserController.changePassword);

router.post("/sign-in", validateMiddleware(signInSchema), UserController.signIn);

router.get("/is-auth", isAuthenticatedMiddleware, (req: any, res: Response) => {
  return res.status(200).json({
    user: req.user,
  });
});

router.post("/update-profile", isAuthenticatedMiddleware, fileParserMiddleware, UserController.updateProfile);

// //Test endpoint for auth middleware
// router.get("/users", isAuthenticatedMiddleware, UserController.getUsers);

router.post("/log-out", isAuthenticatedMiddleware, UserController.logOut);

export default router;
