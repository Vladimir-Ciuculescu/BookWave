import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Audio } from "expo-av";
import { RootState } from "redux/store";
import { AudioFile } from "types/interfaces/audios";
import type { PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps {
  track: Audio.Sound | undefined;
  audio: AudioFile | undefined;
  isPlaying: boolean;
  progress: number;
  duration: number;
  didFinish: boolean;
  visibleModalPlayer: boolean;
}

// ? Initial State
const initialState: InitialStateProps = {
  track: undefined,
  audio: undefined,
  isPlaying: false,
  progress: 0,
  duration: 0,
  didFinish: false,
  visibleModalPlayer: false,
};

// ? Reducer
const playerReducer = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    setTrack: (state, action: any) => {
      state.track = action.payload;
    },
    setAudio: (state, action: PayloadAction<AudioFile>) => {
      state.audio = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setDidFinish: (state, action: PayloadAction<boolean>) => {
      state.didFinish = action.payload;
    },
    setVisibileModalPlayer: (state, action: PayloadAction<boolean>) => {
      state.visibleModalPlayer = action.payload;
    },
  },
});

// ? Actions
export const setTrackAction = playerReducer.actions.setTrack;
export const setAudioAction = playerReducer.actions.setAudio;
export const setIsPlayingAction = playerReducer.actions.setIsPlaying;
export const setDurationAction = playerReducer.actions.setDuration;
export const setProgressAction = playerReducer.actions.setProgress;
export const setDidFinishAction = playerReducer.actions.setDidFinish;
export const setVisibileModalPlayerAction = playerReducer.actions.setVisibileModalPlayer;

const rootSelector = (state: RootState) => state;

// ? Selectors
export const playerSelector = createSelector(rootSelector, (state) => state.player);

export default playerReducer.reducer;
