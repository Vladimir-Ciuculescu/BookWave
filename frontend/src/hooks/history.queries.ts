import HistoryService from "api/history.api";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";

interface useFetchHistoryProps {
  isFocused: boolean;
}

export const useFetchHistory = (payload: useFetchHistoryProps) => {
  const dispatch = useDispatch();
  const query = useQuery(["history", payload], {
    queryFn: () => HistoryService.getHistory(),
    onError: () => {
      dispatch(setToastMessageAction({ message: "Something went wrong !", type: "error" }));
    },
    //@ts-ignore
    enabled: payload === true,
  });

  return query;
};
