import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import AudioService from "api/audios.api";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import ProfileService from "api/profiles.api";
import PlayListService from "api/playlists.api";

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  const query = useQuery(["latest-uploads"], {
    queryFn: () => AudioService.getLatestAudiosApi(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
  });

  return query;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();
  const query = useQuery(["recommeneded-audios"], {
    queryFn: () => ProfileService.getRecommendedAudiosApi(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
  });

  return query;
};

export const useFetchPlaylistsByProfile = () => {
  const dispatch = useDispatch();
  const query = useQuery(["playlists-by-profile"], {
    queryFn: () => PlayListService.getPlayListsByProfileApi(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
  });

  return query;
};
