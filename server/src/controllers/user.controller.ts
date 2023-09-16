import { UserRequest } from "types/user.request";
import UserModel, { UserDocument } from "models/user.model";
import { sendEmail } from "utils/sendEmail";
import { generateToken } from "utils/generateToken";
import EmailVerificationTokenModel, { EmailVertificationTokenDocument } from "models/email-vertification.model";
import path from "path";
import { VerifyEmailRequest } from "types/verify-email.request.";
import { isValidObjectId } from "mongoose";
import { ReVerifyEmailRequest } from "types/re-verrify-email.request";
import { ForgotPasswordRequest } from "types/forgot-password.request";
import PasswordResetTokenModel, { PasswordResetTokenDocument } from "models/password-reset-token.model";
import crypto from "crypto";
import { verifyEmailTemplate } from "../mail/verify-email.template";
import { resetPasswordTemplate } from "../mail/reset-password.template";

const addUser = async (req: UserRequest, res: any) => {
  const { name, email, password } = req.body;

  const user = new UserModel<UserDocument>({
    name,
    email,
    password,
    verified: false,
    favorites: [],
    followers: [],
    followings: [],
    tokens: [],
  });

  try {
    const newUser = await UserModel.create<UserDocument>(user);

    const token = generateToken();

    const emailVerificationToken = new EmailVerificationTokenModel<EmailVertificationTokenDocument>({
      //@ts-ignore
      owner: newUser._id,
      token: token,
    });

    await EmailVerificationTokenModel.create<EmailVertificationTokenDocument>(emailVerificationToken);

    sendEmail(
      user.email,
      "vladimir.ciuculescu@gmail.com",
      `Welcome, ${user.name}`,
      verifyEmailTemplate({
        title: "Welcome to BookWave",
        message: "Welcome again",
        logo: "cid:logo",
        banner: "cid:password_reset",
        link: "#",
        btnTitle: token,
      }),
      [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo",
        },
        {
          filename: "password_reset.png",
          path: path.join(__dirname, "../assets/password_reset.png"),
          cid: "password_reset",
        },
      ],
    );

    return res.status(201).json({
      user: newUser,
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Email already exists !",
      });
    }
    return res.status(422).json({
      error: error,
    });
  }
};

const sendVerificationToken = async (req: VerifyEmailRequest, res: any) => {
  const { token, userId } = req.body;

  try {
    const emailVerificationToken = await EmailVerificationTokenModel.findOne({
      owner: userId,
    });

    if (!emailVerificationToken) {
      res.status(403).json({
        message: "Invalid token !",
      });
    }

    const validToken = await emailVerificationToken?.compareToken(token);

    if (!validToken) {
      res.status(403).json({
        message: "Invalid token !",
      });
    }

    await UserModel.findByIdAndUpdate(userId, { verified: true });

    await EmailVerificationTokenModel.findByIdAndDelete(emailVerificationToken!._id);

    return res.status(201).json({ message: "Your email has been verified !" });
  } catch (error) {
    console.log(error);

    return res.status(422).json({
      error: error,
    });
  }
};

const resendVerificationToken = async (req: ReVerifyEmailRequest, res: any) => {
  const { userId } = req.body;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(403).json({ error: "Invalid user Id" });
    }

    await EmailVerificationTokenModel.findOneAndDelete({ owner: userId });

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(403).json({ error: "This user does not exist !" });
    }

    const token = generateToken();

    const emailVerificationToken = new EmailVerificationTokenModel<EmailVertificationTokenDocument>({
      //@ts-ignore
      owner: user?._id,
      token: token,
    });

    await EmailVerificationTokenModel.create<EmailVertificationTokenDocument>(emailVerificationToken);

    sendEmail(
      user!.email,
      "vladimir.ciuculescu@gmail.com",
      `Welcome, ${user!.name}`,
      verifyEmailTemplate({
        title: "Welcome to BookWave",
        message: "Welcome again",
        logo: "cid:logo",
        banner: "cid:password_reset",
        link: "#",
        btnTitle: token,
      }),
      [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo",
        },
        {
          filename: "password_reset.png",
          path: path.join(__dirname, "../assets/password_reset.png"),
          cid: "password_reset",
        },
      ],
    );

    return res.status(201).json({
      message: "Token verification re-sent. Please check your email !",
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      error: error,
    });
  }
};

const forgotPassword = async (req: ForgotPasswordRequest, res: any) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User does not exist !" });
    }

    await PasswordResetTokenModel.findOneAndDelete({ owner: user._id });

    const token = crypto.randomBytes(36).toString("hex");

    const passwordResetToken = new PasswordResetTokenModel<PasswordResetTokenDocument>({
      //@ts-ignore
      owner: user._id,
      token,
    });

    await PasswordResetTokenModel.create<PasswordResetTokenDocument>(passwordResetToken);

    const baseLink = process.env.PASSWORD_RESET_LINK;

    const passwordResetLink = `${baseLink}?token=${token}?userId=${user._id}`;

    sendEmail(
      user!.email,
      "vladimir.ciuculescu@gmail.com",
      "Reset password Link",
      resetPasswordTemplate({
        title: "Reset password",
        message: "It looks like you forgot your password. Use the link below to create a new one",
        logo: "cid:logo",
        banner: "cid:password_reset",
        link: passwordResetLink,
        btnTitle: "Reset password",
      }),
      [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo",
        },
        {
          filename: "password_reset.png",
          path: path.join(__dirname, "../assets/password_reset.png"),
          cid: "password_reset",
        },
      ],
    );

    return res.status(201).json({ link: passwordResetLink });
  } catch (error) {
    console.log(error);
    res.status(422).json({
      error: error,
    });
  }
};

const UserController = {
  addUser,
  sendVerificationToken,
  resendVerificationToken,
  forgotPassword,
};

export default UserController;
