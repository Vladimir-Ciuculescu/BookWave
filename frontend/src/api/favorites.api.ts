import { apiUrl, getToken } from "api";
import axios from "axios";

export const toggleFavoriteAudio = async (audioId: string) => {
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

const FavoriteController = {
  toggleFavoriteAudio,
};

export default FavoriteController;
