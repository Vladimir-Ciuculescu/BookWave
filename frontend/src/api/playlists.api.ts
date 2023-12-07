import { apiUrl, getToken } from "api";
import axios from "axios";
import {
  AddPlayListRequest,
  GetPlaylistsRequest,
  UpdatePlayListRequest,
} from "types/interfaces/requests/playlists-requests.interfaces";

const getPlayListsByProfileApi = async (payload: GetPlaylistsRequest) => {
  try {
    const { data } = await axios.get(`${apiUrl}/playlist/by-profile`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
      params: payload,
    });
    return data.playlists;
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
