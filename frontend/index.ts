import { AppRegistry } from "react-native";
import App from "./App";
import { expo as appName } from "./app.json";
import TrackPlayer from "react-native-track-player";
import playBackService from "./playback.service";

TrackPlayer.registerPlaybackService(() => playBackService);

AppRegistry.registerComponent(appName.name, () => App);
