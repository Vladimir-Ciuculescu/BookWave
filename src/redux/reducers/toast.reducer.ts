import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "redux/store";

type NotificationType = "success" | "error";

interface InitialStateProps {
  message: string;
  type: NotificationType | undefined;
}

const initialState: InitialStateProps = {
  message: "",
  type: undefined,
};

const toastReducer = createSlice({
  name: "toast",
  initialState: initialState,
  reducers: {
    setToastMessage: (state, action: PayloadAction<InitialStateProps>) => {
      (state.message = action.payload.message), (state.type = action.payload.type);
    },
  },
});

// ? Actions
export const setToastMessageAction = toastReducer.actions.setToastMessage;

// ? Selectors
export const ToastNotificationSelector = createSelector(
  (state: RootState) => state.toast,
  (state) => state,
);

export default toastReducer.reducer;
