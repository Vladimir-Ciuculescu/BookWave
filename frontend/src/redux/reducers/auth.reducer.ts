import { createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "types/interfaces/UserProfile";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    setProfile: (state, action: PayloadAction<UserProfile>) => {
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

// ? Selectors
// export const authSelector = createSelector([rootState], (state) => state.auth);

export default authReducer.reducer;
