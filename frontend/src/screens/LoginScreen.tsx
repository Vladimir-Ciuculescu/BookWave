import React from "react";
import { StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import BWInput from "components/shared/BWInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import { loginSchema } from "yup/loginSchemta";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import { StackNavigatorProps } from "types/interfaces/stack-navigator";
import BWButton from "components/shared/BWButton";

import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import { StatusBar } from "expo-status-bar";

import BWFadeInContainer from "components/shared/BWFadeInContainer";

const { width, height } = Dimensions.get("window");

interface LoginData {
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
  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const goToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleLogin = async () => {};

  return (
    <BWAuthScreenContainer
      image="https://images.pexels.com/photos/7241298/pexels-photo-7241298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      navigation={navigation}
    >
      <StatusBar style="dark" />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              <Text style={styles.title}>Witness the best audio experience</Text>
              <Text style={styles.subtitle}>Hello, sign in to continue</Text>
              <BWForm
                initialValues={initialValues}
                onSubmit={handleLogin}
                validationSchema={loginSchema}
              >
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWInput name="email" autoCapitalize="sentences" placeholder="Email" />
                    <BWInput name="password" autoCapitalize="none" placeholder="Password" />
                  </View>

                  <View style={styles.options}>
                    <BWButton title="Forgot Password" link onPress={goToForgotPassword} />
                    <BWButton title="Sign Up" link onPress={goToRegister} />
                  </View>
                  <BWSubmitButton title="Log in" />
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

  signUpLabel: {
    fontFamily: "Minomu",
    fontSize: 16,
  },
});
