import HistoryService from "api/history.api";
import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (e) => {
    const list = await TrackPlayer.getQueue();

    const audio = list[e.track];

    const payload = {
      audio: audio.id,
      progress: e.position,
      date: new Date(Date.now()),
    };

    await HistoryService.updateAudioHistoryApi(payload);
  });
};
