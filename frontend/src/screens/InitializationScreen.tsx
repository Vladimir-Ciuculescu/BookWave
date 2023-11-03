import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserService from "api/users.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/StackNavigatorProps";

const InitializationScreen: React.FC<any> = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  const getIsLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("Login");
      }
      if (token) {
        const data = await UserService.isAuthApi(token);
        dispatch(setProfileAction(data.user));
        dispatch(setLoggedInAction(true));
        navigation.replace("App");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIsLoggedIn();
  }, []);

  return null;
};

export default InitializationScreen;
