import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Text from "react-native-ui-lib/text";
import RegisterScreen from "screens/RegisterScreen";
import { COLORS } from "utils/colors";

export default function App() {
  const [fontsLoaded] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <RegisterScreen />;
}
