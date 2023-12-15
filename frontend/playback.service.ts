import TrackPlayer, { Event } from "react-native-track-player";

const playBackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {});
};

export default playBackService;
