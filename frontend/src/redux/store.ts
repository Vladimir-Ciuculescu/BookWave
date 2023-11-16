import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer";
import toastReducer from "./reducers/toast.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
});

// const store = configureStore({
//   reducer: authReducer,
// });
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
