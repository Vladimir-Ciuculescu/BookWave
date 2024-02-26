import { apiUrl, getToken } from "api";
import axios from "axios";
import { GetFavoritesRequest } from "types/interfaces/requests/favorites-requests.interfaces";

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
  toggleFavoriteAudioApi,
  getIsFavoriteApi,
};

export default FavoriteService;
