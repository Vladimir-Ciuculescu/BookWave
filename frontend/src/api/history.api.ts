import { apiUrl, getToken } from "api";
import axios from "axios";
import { UpdateAudioHistoryRequest } from "types/interfaces/requests/history-requests.interfaces";

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
  updateAudioHistoryApi,
};

export default HistoryService;
