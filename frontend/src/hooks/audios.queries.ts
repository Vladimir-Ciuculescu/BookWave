import AudioService from "api/audios.api";
import ProfileService from "api/profiles.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";

interface useFetchAudiosByProfileProps {
  isFocused: boolean;
}

interface useFetchAudiosTotalCountByProfileProps {
  isFocused: boolean;
}

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

export const useFetchAudiosTotalCountByProfile = (payload: useFetchAudiosTotalCountByProfileProps) => {
  const dispatch = useDispatch();
  const query = useQuery(["audios-total-count-by-profile", payload], {
    queryFn: () => ProfileService.getAudiosTotalCountByProfile(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
    enabled: payload.isFocused === true,
  });

  return query;
};

export const useFetchAudiosByProfile = (payload: useFetchAudiosByProfileProps) => {
  const dispatch = useDispatch();
  const query = useQuery(["audios-by-profile", payload], {
    queryFn: () => ProfileService.getAudiosByProfile(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
    enabled: payload.isFocused === true,
  });

  return query;
};
