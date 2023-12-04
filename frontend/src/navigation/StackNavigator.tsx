import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "screens/ForgotPassword/ForgotPasswordScreen";
import LoginScreen from "screens/Login/LoginScreen";
import OTPVerificationScreen from "screens/OTPVerification/OTPVerificationScreen";
import { StackNavigatorProps } from "types/interfaces/navigation";
import TabNavigator from "./TabNavigator";
import InitializationScreen from "screens/InitializationScreen";
import RegisterScreen from "screens/Register/RegisterScreen";

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
