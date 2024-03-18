import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import ToastNotification from "components/ToastNotification";
import { COLORS } from "utils/colors";
import StackNavigator from "./StackNavigator";

const NavigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.DARK[50],
    card: COLORS.DARK[200],
    text: COLORS.MUTED[50],
  },
};

const AppNavigator: React.FC<any> = () => {
  return (
    <NavigationContainer theme={NavigatorTheme}>
      <StackNavigator />
      <ToastNotification />
    </NavigationContainer>
  );
};

export default AppNavigator;
