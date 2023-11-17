import FavoriteService from "api/favorites.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";

export const useFetchFavorites = () => {
  const dispatch = useDispatch();
  const query = useQuery(["favorites"], {
    queryFn: () => FavoriteService.getFavoritesApi(),
    onError: (error: any) => {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    },
  });
  return query;
};
