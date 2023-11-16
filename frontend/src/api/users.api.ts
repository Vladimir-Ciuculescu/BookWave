import { apiUrl, getToken } from "api";
import axios from "axios";
import { LoginData } from "screens/LoginScreen";
import { RegisterData } from "screens/RegisterScreen";
import { SendVerificationEmailRequest } from "types/interfaces/auth-requests.interfaces";

const registerApi = async (payload: RegisterData) => {
  try {
    const { data } = await axios.post<any, any>(`${apiUrl}/users/add`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const loginApi = async (payload: LoginData) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/sign-in`, payload);
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

const isAuthApi = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/is-auth`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const sendVerificationTokenApi = async (payload: SendVerificationEmailRequest) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/verify-email`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const resendVerificationTokenApi = async (userId: string) => {
  try {
    const data = await axios.post<any, any>(`${apiUrl}/users/re-verify-email`, { userId });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const forgotPasswordApi = async (email: string) => {
  try {
    const response = await axios.post(`${apiUrl}/users/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data;
  }
};

const UserService = {
  registerApi,
  loginApi,
  isAuthApi,
  sendVerificationTokenApi,
  resendVerificationTokenApi,
  forgotPasswordApi,
};

export default UserService;
