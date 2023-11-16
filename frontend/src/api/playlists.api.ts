import { apiUrl, getToken } from "api";
import axios from "axios";
import {
  AddPlayListRequest,
  UpdatePlayListRequest,
} from "types/interfaces/playlists-requests.interfaces";

const getPlayListsByProfileApi = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/playlist/by-profile`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const addPlayListApi = async (payload: AddPlayListRequest) => {
  try {
    await axios.post(`${apiUrl}/playlist/add`, payload, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const updatePlayListApi = async (payload: UpdatePlayListRequest) => {
  try {
    await axios.patch(`${apiUrl}/playlist/update`, payload, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const PlayListService = {
  getPlayListsByProfileApi,
  addPlayListApi,
  updatePlayListApi,
};

export default PlayListService;
