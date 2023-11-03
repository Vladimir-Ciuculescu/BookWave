import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { DefaultTheme } from "@react-navigation/native";
import { COLORS } from "utils/colors";
import { Text } from "react-native-ui-lib";

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
    </NavigationContainer>
  );
};

export default AppNavigator;
