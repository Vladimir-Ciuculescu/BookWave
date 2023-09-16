import * as Yup from "yup";
import { isValidObjectId } from "mongoose";

export const tokenSchema = Yup.object().shape({
  token: Yup.string().trim().required("The token is required !"),
  userId: Yup.string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }

      return "";
    })
    .required("Invalid user Id"),
});
