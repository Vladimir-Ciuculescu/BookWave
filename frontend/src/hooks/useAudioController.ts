import * as _ from "lodash";
import TrackPlayer, { State, Track, useActiveTrack, usePlaybackState } from "react-native-track-player";
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
};

const useAudioController = () => {
  const { state } = usePlaybackState();

  const { audio, list } = useSelector(playerSelector);
  const dispatch = useDispatch();
  const currentTrack = useActiveTrack();

  const isPlaying = state === State.Playing;
  const isPlayerReady = state !== State.None && state !== undefined;

  const skipTo = async (second: number) => {
    const { position } = await TrackPlayer.getProgress();

    await TrackPlayer.seekTo(position + second);
  };

  const replayList = async (data: AudioFile[]) => {
    await TrackPlayer.reset();
    await updateQueue(data);
    await TrackPlayer.skip(0);
    await TrackPlayer.play();
  };

  const onAudioPress = async (track: AudioFile, data: AudioFile[]) => {
    if (state === State.Ended) {
      await TrackPlayer.seekTo(0);
      await TrackPlayer.play();
      return;
    }

    if (state === undefined || state === State.None) {
      await updateQueue(data);
      const trackIndex = data.findIndex((audio) => audio.id === track.id);
      await TrackPlayer.skip(trackIndex);
      await TrackPlayer.play();
      dispatch(setAudiosListAction(data));
      dispatch(setAudioAction(track));
      return;
    }

    //! Remember, this case was the last one in function
    if (track.id !== audio!.id || currentTrack!.id !== track.id) {
      if (!_.isEqual(list, data)) {
        await TrackPlayer.reset();
        await updateQueue(data);

        dispatch(setAudiosListAction(data));
      }

      const trackIndex = data.findIndex((audio) => audio.id === track.id);

      await TrackPlayer.skip(trackIndex);
      await TrackPlayer.play();
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
  };

  return { onAudioPress, isPlaying, isPlayerReady, skipTo, replayList };
};

export default useAudioController;
