import { apiUrl, getToken } from "api";
import axios from "axios";
import { UpdateAudioHistoryRequest } from "types/interfaces/requests/history-requests.interfaces";

const getHistory = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/history`, { headers: { Authorization: `Bearer=${await getToken()}` } });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const updateAudioHistoryApi = async (payload: UpdateAudioHistoryRequest) => {
  try {
    const { data } = await axios.post(`${apiUrl}/history`, payload, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const HistoryService = {
  getHistory,
  updateAudioHistoryApi,
};

export default HistoryService;
