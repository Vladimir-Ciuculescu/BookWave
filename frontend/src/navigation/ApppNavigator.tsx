import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { DefaultTheme } from "@react-navigation/native";
import { COLORS } from "utils/colors";
import ToastNotification from "components/ToastNotification";

const NavigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.DARK[50],
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
