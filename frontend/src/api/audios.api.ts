import { apiUrl, getToken } from "api";
import axios from "axios";

const uploadAudioApi = async (formData: FormData) => {
  try {
    await axios.post(`${apiUrl}/audio/add`, formData, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const getLatestAudiosApi = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/audio/latest`);
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const AudioService = {
  uploadAudioApi,
  getLatestAudiosApi,
};

export default AudioService;
