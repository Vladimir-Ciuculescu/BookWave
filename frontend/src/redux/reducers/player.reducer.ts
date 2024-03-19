import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { AudioFile } from "types/interfaces/audios";

interface InitialStateProps {
  audio: AudioFile | undefined;
  visibleModalPlayer: boolean;
  list: AudioFile[];
  latest: AudioFile[];
  recommended: AudioFile[];
}

// ? Initial State
const initialState: InitialStateProps = {
  audio: undefined,
  visibleModalPlayer: false,
  list: [],
  latest: [],
  recommended: [],
};

// ? Reducer
const playerReducer = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    setAudio: (state, action: PayloadAction<AudioFile | undefined>) => {
      state.audio = action.payload;
    },

    setVisibileModalPlayer: (state, action: PayloadAction<boolean>) => {
      state.visibleModalPlayer = action.payload;
    },
    setAudiosList: (state, action: PayloadAction<AudioFile[]>) => {
      state.list = action.payload;
    },
    setLatestAudios: (state, action: PayloadAction<AudioFile[]>) => {
      state.latest = action.payload;
    },
    setRecommendedAudios: (state, action: PayloadAction<AudioFile[]>) => {
      state.recommended = action.payload;
    },
  },
});

// ? Actions
export const setAudioAction = playerReducer.actions.setAudio;
export const setVisibileModalPlayerAction = playerReducer.actions.setVisibileModalPlayer;
export const setAudiosListAction = playerReducer.actions.setAudiosList;
export const setLatestAudiosAction = playerReducer.actions.setLatestAudios;
export const setRecommendedAudiosAction = playerReducer.actions.setRecommendedAudios;

const rootSelector = (state: RootState) => state;

// ? Selectors
export const playerSelector = createSelector(rootSelector, (state) => state.player);

export default playerReducer.reducer;
