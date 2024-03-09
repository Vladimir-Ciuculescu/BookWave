import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { AudioFile } from "types/interfaces/audios";

interface InitialStateProos {
  optionsVisible: boolean;
  playlistsVisible: boolean;
  newPlaylistVisible: boolean;
  selectedAudio: AudioFile | undefined;
}

// ? Initial State
const initialState: InitialStateProos = {
  optionsVisible: false,
  playlistsVisible: false,
  newPlaylistVisible: false,
  selectedAudio: undefined,
};

// ? Reducer
const audioActionsReducer = createSlice({
  name: "audioActions",
  initialState: initialState,
  reducers: {
    toggleOptionsBottomSheet: (state, action: PayloadAction<boolean>) => {
      state.optionsVisible = action.payload;
    },

    togglePlaylistsBottomSheet: (state, action: PayloadAction<boolean>) => {
      state.playlistsVisible = action.payload;
    },

    toggleNewPlaylistBottomSheet: (state, action: PayloadAction<boolean>) => {
      state.newPlaylistVisible = action.payload;
    },
    setSelectedAudio: (state, action: PayloadAction<AudioFile>) => {
      state.selectedAudio = action.payload;
    },
  },
});

// ? Actions
export const toggleOptionBottomSheetsAction = audioActionsReducer.actions.toggleOptionsBottomSheet;
export const togglePlaylistsBottomSheetAction = audioActionsReducer.actions.togglePlaylistsBottomSheet;
export const toggleNewPlaylistBottomSheetAction = audioActionsReducer.actions.toggleNewPlaylistBottomSheet;
export const setSelectedAudioAction = audioActionsReducer.actions.setSelectedAudio;

const rootSelector = (state: RootState) => state;

// ? Selectors
export const audioActionsSelector = createSelector(rootSelector, (state) => state.audioActions);

export default audioActionsReducer.reducer;
