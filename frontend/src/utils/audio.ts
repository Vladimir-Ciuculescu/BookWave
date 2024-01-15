import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { Audio } from "expo-av";
import {
  setAudioAction,
  setDidFinishAction,
  setDurationAction,
  setIsPlayingAction,
  setProgressAction,
  setTrackAction,
} from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";

export const loadAudio = async (dispatch: Dispatch<AnyAction>, item: AudioFile) => {
  const { sound, status }: { sound: Audio.Sound; status: any } = await Audio.Sound.createAsync(
    { uri: item.file },
    { shouldPlay: true },
    (status: any) => {
      dispatch(setProgressAction(status.positionMillis));
      if (status.didJustFinish) {
        dispatch(setIsPlayingAction(false));
        dispatch(setDidFinishAction(true));
      }
    },
  );
  dispatch(setDurationAction(status.durationMillis));
  dispatch(setTrackAction(sound as any));
  dispatch(setAudioAction(item));
  dispatch(setIsPlayingAction(true));
};
