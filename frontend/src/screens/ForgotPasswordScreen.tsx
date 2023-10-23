import React from "react";
import { StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import BWInput from "components/shared/BWInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";

import { loginSchema } from "yup/loginSchemta";
import BWBackButton from "components/shared/BWBackButton";
import { NavigationProp } from "@react-navigation/native";
import { StackNavigatorProps } from "types/interfaces/stack-navigator";
import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import BWButton from "components/shared/BWButton";
import BWFadeInContainer from "components/shared/BWFadeInContainer";

const { width, height } = Dimensions.get("window");

interface ForgotPasswordData {
  email: string;
}

const initialValues: ForgotPasswordData = {
  email: "",
};

interface ForgotPasswordScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const goToSignUp = () => {
    navigation.navigate("Register");
  };

  return (
    <BWAuthScreenContainer
      image="https://images.pexels.com/photos/5703540/pexels-photo-5703540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      navigation={navigation}
    >
      <BWBackButton navigation={navigation} />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              <Text style={styles.title}>Fill in your email to get a new password</Text>

              <BWForm
                initialValues={initialValues}
                onSubmit={() => {}}
                validationSchema={loginSchema}
              >
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWInput
                      placeholderTextColor={COLORS.MUTED[600]}
                      name="email"
                      autoCapitalize="sentences"
                      placeholder="Email"
                    />
                  </View>
                  <View style={styles.options}>
                    <BWButton link title="Sign In" onPress={goToSignIn} />
                    <BWButton link title="Sign Up" onPress={goToSignUp} />
                  </View>
                  <BWSubmitButton style={{ width: "100%" }} title="Send link" />
                </View>
              </BWForm>
            </View>
          </BWFadeInContainer>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </BWAuthScreenContainer>
  );
};

export default ForgotPasswordScreen;

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
    transform: [{ scale: 1.2 }],
  },
  overflow: {
    backgroundColor: "rgba(0,0,0,0.45)",
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
    color: COLORS.MUTED[50],
    marginBottom: 12,
    paddingRight: 40,
    fontFamily: "MinomuBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.MUTED[600],
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
