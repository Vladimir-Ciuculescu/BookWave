import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserService from "api/users.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";

const InitializationScreen: React.FC<any> = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  const getIsLoggedIn = async () => {
    try {
      const data = await UserService.isAuthApi();

      if (data.user) {
        const isUserVerified = await UserService.isVerifiedApi(data.user.id);

        dispatch(setProfileAction(data.user));
        dispatch(setLoggedInAction(true));

        // navigation.replace("App");

        if (isUserVerified) {
          navigation.replace("App");
        } else {
          navigation.replace("OTPVerification", { userId: data.user.id, isLoggedIn: true });
        }
      } else {
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error);
      navigation.replace("Login");
    }
  };

  useEffect(() => {
    getIsLoggedIn();
  }, []);

  return null;
};

export default InitializationScreen;
