import * as _ from "lodash";
import TrackPlayer, { RepeatMode, State, Track, usePlaybackState } from "react-native-track-player";
import { useDispatch, useSelector } from "react-redux";
import { playerSelector, setAudioAction, setAudiosListAction } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";

const updateQueue = async (data: AudioFile[]) => {
  const lists: Track[] = data.map((track) => {
    return {
      id: track.id,
      title: track.title,
      url: track.file,
      artwork: track.poster,
      artist: track.owner.name,
      genre: track.category,
      isLiveStream: true,
      about: track.about,
      owner: track.owner,
    };
  });

  await TrackPlayer.add([...lists]);

  await TrackPlayer.setRepeatMode(RepeatMode.Off);
};

const useAudioController = () => {
  const { state } = usePlaybackState();

  const { audio, list } = useSelector(playerSelector);
  const dispatch = useDispatch();

  const isPlaying = state === State.Playing;
  const isPlayerReady = state !== State.None && state !== undefined;

  const skipTo = async (second: number) => {
    const { position } = await TrackPlayer.getProgress();

    await TrackPlayer.seekTo(position + second);
  };

  const onAudioPress = async (track: AudioFile, data: AudioFile[]) => {
    if (state === undefined || state === State.None) {
      await updateQueue(data);
      const trackIndex = data.findIndex((audio) => audio.id === track.id);
      await TrackPlayer.skip(trackIndex);
      await TrackPlayer.play();
      dispatch(setAudiosListAction(data));
      dispatch(setAudioAction(track));
      return;
    }

    if (state === State.Playing && audio!.id === track.id) {
      await TrackPlayer.pause();
      return;
    }

    if (state === State.Paused && audio!.id === track.id) {
      await TrackPlayer.play();
      return;
    }

    if (track.id !== audio!.id) {
      if (!_.isEqual(list, data)) {
        await TrackPlayer.reset();
        await updateQueue(data);

        dispatch(setAudiosListAction(data));
      }

      const trackIndex = data.findIndex((audio) => audio.id === track.id);

      await TrackPlayer.skip(trackIndex);
      await TrackPlayer.play();
      dispatch(setAudioAction(track));
    }
  };

  return { onAudioPress, isPlaying, isPlayerReady, skipTo };
};

export default useAudioController;
