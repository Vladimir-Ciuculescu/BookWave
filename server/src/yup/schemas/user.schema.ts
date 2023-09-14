import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required !")
    .min(3, "Name is too short !")
    .max(20, "Name is too long"),
  email: Yup.string().required("Email is missing").email("Not a valid email !"),
  password: Yup.string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short"),
});
