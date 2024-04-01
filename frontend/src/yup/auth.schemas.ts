import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("This is not a valid email !").required("Email required !"),
  password: Yup.string().required("Password is required !"),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().trim("Name is missing !").min(3, "Invalid name").required("Name is required !"),
  email: Yup.string().email("This is not a valid email !").required("Email required !"),
  password: Yup.string().min(8, "Password must have at least 8 characters").required("Password is required !"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("This is not a valid email !").required("Email required !"),
});
