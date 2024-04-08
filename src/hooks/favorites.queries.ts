import FavoriteService from "api/favorites.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { GetFavoritesRequest, GetFavoritesTotalCountRequest } from "types/interfaces/requests/favorites-requests.interfaces";

export const useFetchFavorites = (payload: GetFavoritesRequest) => {
  const dispatch = useDispatch();
  const query = useQuery(["favorites", payload], {
    queryFn: () => FavoriteService.getFavoritesApi(payload),
    onError: () => {
      dispatch(setToastMessageAction({ message: "Something went wrong !", type: "error" }));
    },
  });
  return query;
};

export const useFetchFavoritesTotalCount = (payload: GetFavoritesTotalCountRequest) => {
  const dispatch = useDispatch();
  const query = useQuery(["favorites-total-count", payload], {
    queryFn: () => FavoriteService.getFavoritesTotalCountapi(payload),
    onError: () => {
      dispatch(setToastMessageAction({ message: "Something went wrong !", type: "error" }));
    },
  });
  return query;
};
