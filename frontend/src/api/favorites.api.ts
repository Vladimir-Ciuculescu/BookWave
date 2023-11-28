import { apiUrl, getToken } from "api";
import axios from "axios";

export const getFavoritesApi = async (
  payload: any,
  // limit: number,
  //categories: any[]
) => {
  try {
    const { data } = await axios.get(`${apiUrl}/favorites`, {
      headers: {
        Authorization: `Bearer=${await getToken()}`,
      },
      // params: {
      //   limit: limit,
      //   //categories: categories,
      // },
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

const FavoriteService = {
  getFavoritesApi,
  toggleFavoriteAudioApi,
};

export default FavoriteService;
