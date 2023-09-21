import { isValidObjectId } from "mongoose";
import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
  userId: Yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    }

    return "";
  }),
  password: Yup.string().trim().required("Password is required !").min(8, "Password is too short !"),
});
