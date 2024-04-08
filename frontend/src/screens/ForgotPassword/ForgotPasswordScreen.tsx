import { NavigationProp } from "@react-navigation/native";
import UserService from "api/users.api";
import BWAuthInput from "components/shared/BWAuthInput";
import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import BWBackButton from "components/shared/BWBackButton";
import BWButton from "components/shared/BWButton";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, View } from "react-native-ui-lib";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import { forgotPasswordSchema } from "yup/auth.schemas";

const { width, height } = Dimensions.get("window");

interface ForgotPasswordData {
  email: string;
  password: string;
}

const initialValues: ForgotPasswordData = {
  email: "",
  password: "",
};

interface ForgotPasswordScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const goToSignUp = () => {
    navigation.navigate("Register");
  };

  const handleSubmit = async (values: ForgotPasswordData) => {
    try {
      setLoading(true);
      await UserService.changePassword(values);

      if (errorMessage) {
        setErrorMessage("");
      }

      Alert.alert("Success", "Your password was succesfully changed !", [{ text: "Ok", onPress: () => goToSignIn() }]);
    } catch (error: any) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <BWAuthScreenContainer image={require("../../../assets/images/forgot-password_background_image.webp")} navigation={navigation}>
      <StatusBar style="light" />
      <BWBackButton navigation={navigation} />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              {/* <Text style={styles.title}>Fill in your email to get a new password</Text> */}
              <Text style={styles.title}>Choose a new password</Text>

              <BWForm initialValues={initialValues} onSubmit={handleSubmit} validationSchema={forgotPasswordSchema}>
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWAuthInput name="email" autoCapitalize="none" placeholder="Email" placeholderTextColor={COLORS.MUTED[50]} />
                    <BWAuthInput name="password" autoCapitalize="none" placeholder="New password" secureTextEntry />
                  </View>
                  <View style={styles.options}>
                    <BWButton link title="Sign In" onPress={goToSignIn} labelStyle={styles.linkOption} />
                    <BWButton link title="Sign Up" onPress={goToSignUp} labelStyle={styles.linkOption} />
                  </View>
                  <BWSubmitButton loading={loading} style={styles.sendLinkBtn} title="Update" />
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

  linkOption: {
    color: COLORS.MUTED[50],
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

  sendLinkBtn: {
    width: 160,
    height: 50,
  },

  errorMsg: {
    fontSize: 16,
    color: COLORS.DANGER[500],
    fontFamily: "Minomu",
  },
});
