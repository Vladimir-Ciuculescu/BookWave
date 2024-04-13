import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "screens/ForgotPassword/ForgotPasswordScreen";
import InitializationScreen from "screens/InitializationScreen/InitializationScreen";
import Latest_RecommendedScreen from "screens/Latest_Recommended/Latest_RecommendedScreen";
import LoginScreen from "screens/Login/LoginScreen";
import OTPVerificationScreen from "screens/OTPVerification/OTPVerificationScreen";
import PlaylistAudiosScreen from "screens/PlaylistAudios/PlaylistAudiosScreen";
import RegisterScreen from "screens/Register/RegisterScreen";
import SettingsScreen from "screens/Settings/SettingsScreen";
import { StackNavigatorProps } from "types/interfaces/navigation";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<StackNavigatorProps>();

const StackNavigator: React.FC<any> = ({ appReady }) => {
  return (
    <Stack.Navigator initialRouteName="InitialScreen">
      <Stack.Group screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen component={InitializationScreen} name="InitialScreen" />
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={RegisterScreen} name="Register" />
        <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
        <Stack.Screen component={OTPVerificationScreen} name="OTPVerification" />
        <Stack.Screen component={TabNavigator} name="App" />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={SettingsScreen} name="Settings" />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen component={Latest_RecommendedScreen} name="Latest_Recommended" />
        <Stack.Screen component={PlaylistAudiosScreen} name="PlaylistAudios" />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
