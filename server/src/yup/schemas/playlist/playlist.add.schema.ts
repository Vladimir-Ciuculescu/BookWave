import { isValidObjectId } from "mongoose";
import { visibilites } from "types/enums/visibility.enum";
import * as Yup from "yup";

export const addPlayListSchema = Yup.object().shape({
  title: Yup.string().required("Title is missing !"),
  audioId: Yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    }
    return "";
  }),
  visibility: Yup.string().oneOf(visibilites, "Invalid visibility option !").required("Visibility is required !"),
});
