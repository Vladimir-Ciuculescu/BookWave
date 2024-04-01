import HistoryService from "api/history.api";
import TrackPlayer, { Event, PlaybackProgressUpdatedEvent } from "react-native-track-player";

module.exports = async function () {
  let timeoutId: any;
  const debounce = (func: Function, delay: number) => {
    return (...args: any) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const updateHistory = async (e: PlaybackProgressUpdatedEvent) => {
    const list = await TrackPlayer.getQueue();

    if (list.length) {
      const audio = list[e.track];

      const payload = {
        audio: audio.id,
        progress: e.position,
        date: new Date(Date.now()),
      };

      await HistoryService.updateAudioHistoryApi(payload);
    }
  };

  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (e) => {
    const debounceUpdateHistory = debounce(updateHistory, 200);

    debounceUpdateHistory(e);
  });
};
