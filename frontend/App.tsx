import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import store from "redux/store";
import AppNavigator from "navigation/ApppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Text } from "react-native-ui-lib";

export default function App() {
  const [fontsLoaded] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    // <Provider store={store}>
    //   <PortalProvider>
    //     <AppNavigator />
    //   </PortalProvider>
    // </Provider>
    // <Provider store={store}>
    //   <Text>Awdawd</Text>
    // </Provider>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
