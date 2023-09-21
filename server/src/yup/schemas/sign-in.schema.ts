import * as Yup from "yup";

export const signInSchema = Yup.object().shape({
  email: Yup.string().required("The email is required !").email("That's not a valid email address !"),
  password: Yup.string().trim().required("The password is required !").min(8, "The password is too short !"),
});
