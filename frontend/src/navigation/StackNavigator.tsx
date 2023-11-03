import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "screens/ForgotPasswordScreen";
import LoginScreen from "screens/LoginScreen";
import OTPVerificationScreen from "screens/OTPVerificationScreen";
import RegisterScreen from "screens/RegisterScreen";
import { StackNavigatorProps } from "types/interfaces/StackNavigatorProps";
import TabNavigator from "./TabNavigator";

import InitializationScreen from "screens/InitializationScreen";

const Stack = createNativeStackNavigator<StackNavigatorProps>();

const StackNavigator: React.FC<any> = () => {
  return (
    <Stack.Navigator
      initialRouteName="InitialScreen"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen component={InitializationScreen} name="InitialScreen" />
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
      <Stack.Screen component={OTPVerificationScreen} name="OTPVerification" />
      <Stack.Screen component={TabNavigator} name="App" />
    </Stack.Navigator>
  );
};

export default StackNavigator;
