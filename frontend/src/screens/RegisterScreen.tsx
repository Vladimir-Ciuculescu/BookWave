import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Image, Text, View } from "react-native-ui-lib";
import register_screen_background from "../../assets/images/register_screen_background.jpg";
import { COLORS } from "utils/colors";
import BWInput from "components/shared/BWInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const RegisterScreen: React.FC<any> = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const handleValue = (value: string, property: string) => {
    setRegisterData((oldValue) => ({ ...oldValue, [property]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.background} source={register_screen_background} resizeMode="cover" />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} enableOnAndroid={true}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={styles.title}>Witness the best audio experience</Text>
            <Text style={styles.subtitle}>Let's get you started by creating your account</Text>
            <View style={styles.formContainer}>
              <BWInput
                value={registerData.name}
                onChangeText={(e) => handleValue(e, "name")}
                autoCapitalize="sentences"
                placeholder="Name"
              />
              <BWInput value={registerData.email} onChangeText={(e) => handleValue(e, "email")} autoCapitalize="none" placeholder="Email" />
              <BWInput
                value={registerData.password}
                onChangeText={(e) => handleValue(e, "password")}
                autoCapitalize="none"
                secureTextEntry
                placeholder="Password"
              />
            </View>
            <Text style={styles.subtitle}>Forgot Password ?</Text>
            <Button style={styles.signUpBtn} labelStyle={styles.signUpLabel} label="Sign Up" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    opacity: 0.9,
  },
  overflow: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    marginTop: "auto",
    alignItems: "stretch",
    paddingHorizontal: 14,
    marginBottom: 30,
    display: "flex",
    flexDirection: "column",
    gap: 24,
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
    color: COLORS.MUTED[400],
    fontFamily: "Minomu",
  },

  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  signUpBtn: {
    width: 160,
    borderRadius: 14,
    height: 50,
    backgroundColor: COLORS.WARNING[500],
  },
  signUpLabel: {
    fontFamily: "Minomu",
    fontSize: 16,
  },
});
