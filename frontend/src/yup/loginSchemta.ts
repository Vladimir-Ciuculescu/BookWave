import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("This is not a valid email !").required("Email required !"),
  password:
    Yup.string()
    .required("Password is required !"),
});
