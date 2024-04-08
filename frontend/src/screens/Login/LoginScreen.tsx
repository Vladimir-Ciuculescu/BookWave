import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import UserService from "api/users.api";
import BWAuthInput from "components/shared/BWAuthInput";
import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import BWButton from "components/shared/BWButton";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import { StatusBar } from "expo-status-bar";
import { FormikProps, FormikValues } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import { loginSchema } from "yup/auth.schemas";

const { width, height } = Dimensions.get("window");

export interface LoginData {
  email: string;
  password: string;
}

const initialValues: LoginData = {
  email: "",
  password: "",
};

interface LoginScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const formRef = useRef<FormikProps<FormikValues>>(null);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setTimeout(() => {
        clearErrors();
      }, 100);
    });

    return unsubscribe;
  }, [navigation]);

  const clearErrors = () => {
    if (formRef && formRef.current) {
      setErrorMessage("");
      formRef.current.resetForm();
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const goToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const goToHome = () => {
    navigation.navigate("App", { screen: "Home" });
  };

  const goToOTPVerification = (userId: string) => {
    navigation.navigate("OTPVerification", { userId, isLoggedIn: true });
  };

  const handleLogin = async (values: LoginData) => {
    // try {
    //   const userInfo = await UserService.loginApi(values);

    // await AsyncStorage.setItem("token", userInfo.token);

    // let profileData = {
    //   ...userInfo.user,
    //   avatar: userInfo.user.avatar ? userInfo.user.avatar.url : "",
    // };

    // dispatch(setProfileAction(profileData));

    // dispatch(setLoggedInAction(true));
    // goToHome();
    // } catch (error: any) {
    //   setErrorMessage(error.message);
    // }

    try {
      const userInfo = await UserService.loginApi(values);

      const isUserVerified = await UserService.isVerifiedApi(userInfo.user.id);

      await AsyncStorage.setItem("token", userInfo.token);

      let profileData = {
        ...userInfo.user,
        avatar: userInfo.user.avatar ? userInfo.user.avatar.url : "",
      };

      dispatch(setProfileAction(profileData));

      dispatch(setLoggedInAction(true));

      if (isUserVerified) {
        goToHome();
      } else {
        await UserService.resendVerificationTokenApi(userInfo.user.id);
        goToOTPVerification(userInfo.user.id);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <BWAuthScreenContainer image={require("../../../assets/images/login_background_image.webp")} navigation={navigation}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              <Text style={styles.title}>Witness the best audio experience</Text>
              <Text style={styles.subtitle}>Hello, sign in to continue</Text>
              <BWForm initialValues={initialValues} onSubmit={handleLogin} validationSchema={loginSchema} innerRef={formRef}>
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWAuthInput name="email" autoCapitalize="none" placeholder="Email" />
                    <BWAuthInput name="password" autoCapitalize="none" placeholder="Password" secureTextEntry />
                  </View>

                  <View style={styles.options}>
                    <BWButton title="Forgot Password" link onPress={goToForgotPassword} labelStyle={styles.linkOption} />
                    <BWButton title="Sign Up" link onPress={goToRegister} labelStyle={styles.linkOption} />
                  </View>
                  <BWSubmitButton title="Log in" style={styles.signInBtn} />
                  {errorMessage && <Text style={styles.errorMsg}>{errorMessage}</Text>}
                </View>
              </BWForm>
            </View>
          </BWFadeInContainer>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </BWAuthScreenContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overflow: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backBtn: {
    width: 50,
    height: 50,
    top: 15,
    left: 15,
    backgroundColor: COLORS.MUTED[50],
    borderRadius: 14,
  },
  content: {
    marginTop: "auto",
    alignItems: "stretch",
    paddingHorizontal: 14,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  options: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  linkOption: {
    color: COLORS.MUTED[50],
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    paddingRight: 40,
    fontFamily: "MinomuBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.MUTED[200],
    fontFamily: "Minomu",
  },

  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  inputsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  signInBtn: {
    width: 160,
    height: 50,
  },
  errorMsg: {
    fontSize: 16,
    color: COLORS.DANGER[500],
    fontFamily: "Minomu",
  },
});
