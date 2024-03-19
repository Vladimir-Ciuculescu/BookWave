import { useFonts } from "expo-font";
import AppNavigator from "navigation/ApppNavigator";
import { useEffect } from "react";
import { LogBox } from "react-native";
import TrackPlayer from "react-native-track-player";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "redux/store";

LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  "forwardRef render functions accept exactly two parameters: props and ref. Did you forget to use the ref parameter?",
  // "Encountered two children with the same key,",
]);

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();
    };

    setupPlayer();
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
