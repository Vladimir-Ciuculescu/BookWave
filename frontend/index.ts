// <--------- Expo go --------->
// import { AppRegistry } from "react-native";
// import App from "./App";
// import { expo as appName } from "./app.json";
// //import playBackService from "./playback.service";

// // TrackPlayer.registerPlaybackService(() => playBackService);

// AppRegistry.registerComponent(appName.name, () => App);

// <--------- Expo build --------->
import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";
import App from "./App";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require("./track-player-service"));
