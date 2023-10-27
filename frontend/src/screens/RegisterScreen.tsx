import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import BWInput from "components/shared/BWInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import { Feather } from "@expo/vector-icons";
import BWIconButton from "components/shared/BWIconButton";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import BWButton from "components/shared/BWButton";
import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import { StatusBar } from "expo-status-bar";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import UserService from "api/users.api";
import { registerSchema } from "yup/auth.schemas";
import { StackNavigatorProps } from "types/interfaces/StackNavigatorProps";

const { width, height } = Dimensions.get("window");

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const initialValues: RegisterData = {
  name: "",
  email: "",
  password: "",
};

interface RegisterScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const goBack = () => {
    navigation.goBack();
  };

  const goToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const goToOTPVerification = (userInfo: any) => {
    navigation.navigate("OTPVerification", { userInfo });
  };

  const handleRegister = async (values: RegisterData) => {
    try {
      setLoading(true);
      const data = await UserService.registerApi(values);
      setLoading(false);
      setErrorMessage("");
      goToOTPVerification(data);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <BWAuthScreenContainer
      image="https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      navigation={navigation}
    >
      <BWIconButton
        onPress={goBack}
        style={styles.backBtn}
        icon={() => <Ionicons name="md-arrow-back" size={26} color="black" />}
      />
      <StatusBar style="light" />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              <Text style={styles.title}>Witness the best audio experience</Text>
              <Text style={styles.subtitle}>Let's get you started by creating your account</Text>
              <BWForm
                initialValues={initialValues}
                onSubmit={handleRegister}
                validationSchema={registerSchema}
              >
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWInput name="name" autoCapitalize="sentences" placeholder="Name" />
                    <BWInput name="email" autoCapitalize="none" placeholder="Email" />
                    <BWInput
                      name="password"
                      autoCapitalize="none"
                      secureTextEntry={!passwordVisible}
                      placeholder="Password"
                      rightIcon={
                        <Pressable onPress={() => setPasswordVisible((oldValue) => !oldValue)}>
                          <Feather
                            name={passwordVisible ? "eye" : "eye-off"}
                            size={24}
                            color={COLORS.MUTED[200]}
                          />
                        </Pressable>
                      }
                    />
                  </View>
                  <View style={styles.options}>
                    <BWButton
                      title="Forgot Password"
                      link
                      onPress={goToForgotPassword}
                      labelStyle={styles.linkOption}
                    />
                    <BWButton
                      title="Sign In"
                      link
                      onPress={goToSignIn}
                      labelStyle={styles.linkOption}
                    />
                  </View>
                  <BWSubmitButton title="Sign Up" loading={loading} style={styles.signUpBtn} />
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

export default RegisterScreen;

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

  signUpBtn: {
    width: 160,
    height: 50,
  },

  errorMsg: {
    fontSize: 16,
    color: COLORS.DANGER[500],
    fontFamily: "Minomu",
  },
});
