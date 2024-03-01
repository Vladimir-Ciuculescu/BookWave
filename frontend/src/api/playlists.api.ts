import { apiUrl, getToken } from "api";
import axios from "axios";
import {
  AddPlayListRequest,
  GetPlaylistsRequest,
  GetPlaylistsTotalCountRequest,
  RemoveFromPlaylistRequest,
  UpdatePlayListRequest,
  getIsExistentInPlaylistRequest,
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

const getPlayListsTotalCountApi = async (payload: GetPlaylistsTotalCountRequest) => {
  try {
    const { data } = await axios.get(`${apiUrl}/playlist/total-count`, { params: payload, headers: { Authorization: `Bearer=${await getToken()}` } });

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

const removeFromPlaylist = async (payload: RemoveFromPlaylistRequest) => {
  const { playlistId, audioId } = payload;
  try {
    await axios.delete(`${apiUrl}/playlist/delete?playlistId=${playlistId}&audioId=${audioId}&all=no`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const getIsExistentInPlaylist = async (payload: getIsExistentInPlaylistRequest) => {
  const { playlistId, audioId } = payload;

  try {
    const { data } = await axios.get(`${apiUrl}/playlist/is-in-playlist?playlistId=${playlistId}&audioId=${audioId}`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const PlayListService = {
  getPlayListsByProfileApi,
  getPlayListsTotalCountApi,
  addPlayListApi,
  updatePlayListApi,
  removeFromPlaylist,
  getIsExistentInPlaylist,
};

export default PlayListService;
