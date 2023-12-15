import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { UserProfile } from "types/interfaces/users";

interface InitialStateProps {
  profile: UserProfile | null;
  loggedIn: boolean;
}

// ? Initial State
const initialState: InitialStateProps = {
  profile: null,
  loggedIn: false,
};

// ? Reducer
const authReducer = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
});

// ? Actions
export const setProfileAction = authReducer.actions.setProfile;
export const setLoggedInAction = authReducer.actions.setLoggedIn;

const rootSelector = (state: RootState) => state;

// ? Selectors
export const authSelector = createSelector(rootSelector, (state) => state.auth);

export default authReducer.reducer;
