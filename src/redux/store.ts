import { combineReducers, configureStore } from "@reduxjs/toolkit";
import audioActionsReducer from "./reducers/audio-actions.reducer";
import authReducer from "./reducers/auth.reducer";
import playerReducer from "./reducers/player.reducer";
import toastReducer from "./reducers/toast.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  player: playerReducer,
  audioActions: audioActionsReducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
