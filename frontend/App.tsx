import Navigation from "./Navigation";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    Minomu: require("./assets/fonts/Sen-wZy2.otf"),
    MinomuBold: require("./assets/fonts/SenBold-7qoE.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Navigation />;
}
