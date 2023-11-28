import FavoriteService from "api/favorites.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";

export const useFetchFavorites = (data: any) => {
  const dispatch = useDispatch();
  const query = useQuery(["favorites"], {
    queryFn: () => FavoriteService.getFavoritesApi(data),
    onError: () => {
      dispatch(setToastMessageAction({ message: "Something went wrong !", type: "error" }));
    },
  });
  return query;
};
