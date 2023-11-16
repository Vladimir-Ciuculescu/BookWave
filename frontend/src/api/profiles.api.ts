import { getToken } from "api";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getRecommendedAudiosApi = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/profile/recommended`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const ProfileService = {
  getRecommendedAudiosApi,
};

export default ProfileService;
