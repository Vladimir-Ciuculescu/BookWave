import { User } from "types/user";
import UserModel, { UserDocument } from "models/user.model";
import { sendEmail } from "utils/sendEmail";
import { generateToken } from "utils/generateToken";
import EmailVerificationTokenModel, {
  EmailVertificationTokenDocument,
} from "models/email-vertification.model";

const addUser = async (req: User, res: any) => {
  const { name, email, password } = req.body;

  const user = new UserModel<UserDocument>({
    name,
    email,
    password,
    verified: true,
    favorites: [],
    followers: [],
    followings: [],
    tokens: [],
  });

  try {
    const newUser = await UserModel.create<UserDocument>(user);

    const token = generateToken();

    const newEmailVerificationToken =
      new EmailVerificationTokenModel<EmailVertificationTokenDocument>({
        //@ts-ignore
        owner: newUser._id,
        token: token,
      });

    await EmailVerificationTokenModel.create<EmailVertificationTokenDocument>(
      newEmailVerificationToken
    );

    sendEmail(
      user.email,
      "vladimir.ciuculescu@gmail.com",
      `<h1>Your verification token is ${token} </h1>`
    );

    return res.status(201).json({
      user: newUser,
    });
  } catch (error: any) {
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

const UserController = {
  addUser,
};

export default UserController;
