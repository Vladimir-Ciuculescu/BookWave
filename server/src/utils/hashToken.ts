import bcrypt, { hash, compare } from "bcrypt";

export const hashToken = () => {
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, () => {});
};
