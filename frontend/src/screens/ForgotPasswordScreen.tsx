import React, { useState } from "react";
import { StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import BWAuthInput from "components/shared/BWAuthInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import BWBackButton from "components/shared/BWBackButton";
import { NavigationProp } from "@react-navigation/native";
import BWAuthScreenContainer from "components/shared/BWAuthScreenContainer";
import BWButton from "components/shared/BWButton";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import { StatusBar } from "expo-status-bar";
import UserService from "api/users.api";
import { forgotPasswordSchema } from "yup/auth.schemas";
import { StackNavigatorProps } from "types/interfaces/StackNavigatorProps";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const goToSignUp = () => {
    navigation.navigate("Register");
  };

  const handleSubmit = async (values: ForgotPasswordData) => {
    setLoading(true);
    const { email } = values;

    const data = await UserService.forgotPasswordApi(email);

    setLoading(false);

    if (data.error) {
      setErrorMessage(data.error);
      return;
    }

    setErrorMessage("");
    Alert.alert("Success", "An email was sent to your address!. \nPlease verify it", [
      {
        text: "Ok",
      },
    ]);
  };

  return (
    <BWAuthScreenContainer
      image="https://images.pexels.com/photos/5703540/pexels-photo-5703540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      navigation={navigation}
    >
      <StatusBar style="light" />
      <BWBackButton navigation={navigation} />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <BWFadeInContainer>
            <View style={styles.content}>
              <Text style={styles.title}>Fill in your email to get a new password</Text>

              <BWForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={forgotPasswordSchema}
              >
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <BWAuthInput
                      name="email"
                      autoCapitalize="sentences"
                      placeholder="Email"
                      placeholderTextColor={COLORS.MUTED[50]}
                    />
                  </View>
                  <View style={styles.options}>
                    <BWButton
                      link
                      title="Sign In"
                      onPress={goToSignIn}
                      labelStyle={styles.linkOption}
                    />
                    <BWButton
                      link
                      title="Sign Up"
                      onPress={goToSignUp}
                      labelStyle={styles.linkOption}
                    />
                  </View>
                  <BWSubmitButton style={styles.sendLinkBtn} title="Send link" />
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
