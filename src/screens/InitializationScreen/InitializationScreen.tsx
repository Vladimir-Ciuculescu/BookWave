import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserService from "api/users.api";
import { useEffect } from "react";
import { View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { StyleSheet, Dimensions } from "react-native";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import AnimatedLottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("screen");

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
    setTimeout(() => {
      getIsLoggedIn();
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image style={styles.image} source={require("../../../assets/splash-icon.png")} />
      <View style={styles.loadingContainer}>
        <AnimatedLottieView autoPlay loop source={require("../../../assets/animations/loading.json")} />
      </View>
    </View>
  );
};

export default InitializationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK[50],
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width / 2.5,
    height: width / 2.5,
  },
  loadingContainer: {
    width: width,
    height: 100,
  },
});
