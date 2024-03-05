import { apiUrl, getToken } from "api";
import axios from "axios";
import { GetFavoritesRequest, GetFavoritesTotalCountRequest } from "types/interfaces/requests/favorites-requests.interfaces";

export const getFavoritesApi = async (payload: GetFavoritesRequest) => {
  try {
    const { data } = await axios.get(`${apiUrl}/favorites`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },

      params: payload,
    });

    return data.favorites;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const getFavoritesTotalCountapi = async (payload: GetFavoritesTotalCountRequest) => {
  try {
    const { data } = await axios.get(`${apiUrl}/favorites/total-count`, { params: payload, headers: { Authorization: `Bearer=${await getToken()}` } });

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const toggleFavoriteAudioApi = async (audioId: string) => {
  try {
    const { data } = await axios.post(`${apiUrl}/favorites/toggle?audioId=${audioId}`, null, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const getIsFavoriteApi = async (audioId: string) => {
  try {
    const { data } = await axios.get(`${apiUrl}/favorites/is-favorite?audioId=${audioId}`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

const FavoriteService = {
  getFavoritesApi,
  getFavoritesTotalCountapi,
  toggleFavoriteAudioApi,
  getIsFavoriteApi,
};

export default FavoriteService;
