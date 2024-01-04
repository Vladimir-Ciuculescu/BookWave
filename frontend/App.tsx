import { LogBox } from "react-native";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import store from "redux/store";
import AppNavigator from "navigation/ApppNavigator";
import { QueryClientProvider, QueryClient } from "react-query";
import { useEffect } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  // "Encountered two children with the same key,",
]);

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  useEffect(() => {
    const setAudioMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        playThroughEarpieceAndroid: false,
      });
    };

    setAudioMode();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </Provider>
  );
}
