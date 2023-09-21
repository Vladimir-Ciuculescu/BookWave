import * as Yup from "yup";
import { isValidObjectId } from "mongoose";

export const passwordResetTokenSchem = Yup.object().shape({
  token: Yup.string().trim().required("Token is required !"),
  userId: Yup.string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }

      return "";
    })
    .required("The userId is required !"),
});
