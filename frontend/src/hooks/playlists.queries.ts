import PlayListService from "api/playlists.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { GetPlaylistsRequest } from "types/interfaces/requests/playlists-requests.interfaces";

export const useFetchPlaylistsByProfile = (payload: GetPlaylistsRequest) => {
  const dispatch = useDispatch();
  const query = useQuery(["playlists-by-profile"], {
    queryFn: () => PlayListService.getPlayListsByProfileApi(payload),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
  });

  return query;
};
