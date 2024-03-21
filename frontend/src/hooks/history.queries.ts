import HistoryService from "api/history.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";

export const useFetchHistory = () => {
  const dispatch = useDispatch();
  const query = useQuery(["history"], {
    queryFn: () => HistoryService.getHistory(),
    onError: () => {
      dispatch(setToastMessageAction({ message: "Something went wrong !", type: "error" }));
    },
  });

  return query;
};
