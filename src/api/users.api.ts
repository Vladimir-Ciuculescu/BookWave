import { apiUrl, getToken } from "api";
import axios from "axios";
import { LoginData } from "screens/Login/LoginScreen";
import { RegisterData } from "screens/Register/RegisterScreen";
import { ChangePasswordRequest, LogOutRequest, SendVerificationEmailRequest } from "types/interfaces/requests/auth-requests.interfaces";

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

const changePassword = async (payload: ChangePasswordRequest) => {
  try {
    await axios.post(`${apiUrl}/users/change-password`, payload);
  } catch (error: any) {
    throw new Error(error.response.data.error);
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

// const forgotPasswordApi = async (email: string) => {
//   try {
//     const response = await axios.post(`${apiUrl}/users/forgot-password`, { email });
//     return response.data;
//   } catch (error: any) {
//     console.log(error.response.data);
//     return error.response.data;
//   }
// };

const updateProfileApi = async (formData: FormData) => {
  try {
    await axios.post(`${apiUrl}/users/update-profile`, formData, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const isVerifiedApi = async (userId: string) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/is-verified/${userId}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const logOutApi = async (data: LogOutRequest) => {
  try {
    await axios.post(`${apiUrl}/users/log-out`, null, {
      params: data,
      headers: { Authorization: `Bearer=${await getToken()}` },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const UserService = {
  registerApi,
  loginApi,
  changePassword,
  isAuthApi,
  sendVerificationTokenApi,
  resendVerificationTokenApi,
  // forgotPasswordApi,
  updateProfileApi,
  isVerifiedApi,
  logOutApi,
};

export default UserService;
