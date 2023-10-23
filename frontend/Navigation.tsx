import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ForgotPasswordScreen from "screens/ForgotPasswordScreen";
import LoginScreen from "screens/LoginScreen";
import OTPVerificationScreen from "screens/OTPVerificationScreen";
import RegisterScreen from "screens/RegisterScreen";
import { StackNavigatorProps } from "types/interfaces/stack-navigator";

const Stack = createNativeStackNavigator<StackNavigatorProps>();

const Navigation: React.FC<any> = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={RegisterScreen} name="Register" />
        <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
        <Stack.Screen component={OTPVerificationScreen} name="OTPVerification" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
