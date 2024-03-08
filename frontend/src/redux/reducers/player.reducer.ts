import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { AudioFile } from "types/interfaces/audios";

interface InitialStateProps {
  audio: AudioFile | undefined;

  visibleModalPlayer: boolean;
  list: AudioFile[];
}

// ? Initial State
const initialState: InitialStateProps = {
  audio: undefined,
  visibleModalPlayer: false,
  list: [],
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
  },
});

// ? Actions
export const setAudioAction = playerReducer.actions.setAudio;
export const setVisibileModalPlayerAction = playerReducer.actions.setVisibileModalPlayer;
export const setAudiosListAction = playerReducer.actions.setAudiosList;

const rootSelector = (state: RootState) => state;

// ? Selectors
export const playerSelector = createSelector(rootSelector, (state) => state.player);

export default playerReducer.reducer;
