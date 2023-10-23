import axios from "axios";
import { RegisterData } from "screens/RegisterScreen";
import {
  ResendVerificationEmailRequest,
  SendVerificationEmailRequest,
} from "types/interfaces/auth-requests";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const registerApi = async (data: RegisterData) => {
  try {
    const response = await axios.post<any, any>(`${apiUrl}/users/add`, data);
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data;
  }
};

export const sendVerificationTokenApi = async (data: SendVerificationEmailRequest) => {
  try {
    const response = await axios.post(`${apiUrl}/users/verify-email`, data);
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data;
  }
};

export const resendVerificationTokenApi = async (data: ResendVerificationEmailRequest) => {
  try {
    const response = await axios.post(`${apiUrl}/users`);
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data;
  }
};
