import { useFonts } from "expo-font";
import AppNavigator from "navigation/ApppNavigator";
import { useEffect } from "react";
import { LogBox } from "react-native";
import TrackPlayer, { Capability } from "react-native-track-player";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "redux/store";
import * as SplashScreen from "expo-splash-screen";

LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate` with no listeners registered."]);
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,

        capabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
      });
    };

    setupPlayer();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </Provider>
  );
}
