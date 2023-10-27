import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "screens/ForgotPasswordScreen";
import LoginScreen from "screens/LoginScreen";
import OTPVerificationScreen from "screens/OTPVerificationScreen";
import RegisterScreen from "screens/RegisterScreen";
import { StackNavigatorProps } from "types/interfaces/StackNavigatorProps";
import TabNavigator from "./TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "api/users.api";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";

type InitialRouteName = "Login" | "App";

const Stack = createNativeStackNavigator<StackNavigatorProps>();

const StackNavigator: React.FC<any> = () => {
  const [initalRouteName, setInitialRouteNmae] = useState<InitialRouteName | undefined>();
  const dispatch = useDispatch();

  useEffect(() => {
    getIsLoggedIn();
  }, []);

  const getIsLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setInitialRouteNmae("Login");
        return;
      }
      const data = await UserService.isAuthApi(token);
      dispatch(setProfileAction(data.user));
      dispatch(setLoggedInAction(true));
      setInitialRouteNmae("App");
    } catch (error: any) {
      console.log(error.meesage);
    }
  };

  if (!initalRouteName) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initalRouteName}
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
      <Stack.Screen component={OTPVerificationScreen} name="OTPVerification" />
      <Stack.Screen component={TabNavigator} name="App" />
    </Stack.Navigator>
  );
};

export default StackNavigator;
