import { UserRequest } from "types/user";
import UserModel, { UserDocument } from "models/user.model";
import { sendEmail } from "utils/sendEmail";
import { generateToken } from "utils/generateToken";
import EmailVerificationTokenModel, {
  EmailVertificationTokenDocument,
} from "models/email-vertification.model";
import path from "path";
import { generateTemplate } from "../mail/template";
import { VerifyEmailRequest } from "types/email";
import { Response } from "express";

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

    const emailVerificationToken =
      new EmailVerificationTokenModel<EmailVertificationTokenDocument>({
        //@ts-ignore
        owner: newUser._id,
        token: token,
      });

    const newEmailVerificationToken =
      await EmailVerificationTokenModel.create<EmailVertificationTokenDocument>(
        emailVerificationToken
      );

    sendEmail(
      user.email,

      "vladimir.ciuculescu@gmail.com",
      `Welcome, ${user.name}`,
      generateTemplate({
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
      ]
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

const verifyEmail = async (req: VerifyEmailRequest, res: any) => {
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

    await EmailVerificationTokenModel.findByIdAndDelete(
      emailVerificationToken!._id
    );

    return res.status(201).json({ message: "Your email has been verified !" });
  } catch (error) {
    console.log(error);

    return res.status(422).json({
      error: error,
    });
  }
};

const UserController = {
  addUser,
  verifyEmail,
};

export default UserController;
