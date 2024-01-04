import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer";
import toastReducer from "./reducers/toast.reducer";
import playerReducer from "./reducers/player.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  player: playerReducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
