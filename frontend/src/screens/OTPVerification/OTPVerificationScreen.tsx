import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions, FlatList, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button, Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import BWButton from "components/shared/BWButton";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import UserService from "api/users.api";
import { StackNavigatorProps } from "types/interfaces/navigation";

const { width, height } = Dimensions.get("window");

const PIN_LENGTH = 6;
const DIAL_PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];

interface DialButtonProps {
  dial: string;
  onPress: (item: any) => void;
}

const DialButton: React.FC<DialButtonProps> = ({ dial, onPress }) => {
  return (
    <Button
      onPress={() => onPress(dial)}
      disabled={dial === ""}
      style={[styles.dialBtn, { opacity: dial === "" ? 0 : 1 }]}
      label={dial !== "del" ? dial : undefined}
      round
      labelStyle={styles.dialBtnLabel}
      //@ts-ignore
      iconSource={() =>
        dial === "del" ? <Feather name="delete" size={24} color={COLORS.MUTED[50]} /> : null
      }
    />
  );
};

interface OTPVerification {
  navigation: NavigationProp<StackNavigatorProps>;
  route: RouteProp<StackNavigatorProps>;
}

const OTPVerificationScreen: React.FC<OTPVerification> = ({ navigation, route }) => {
  // ? Hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(10);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  useEffect(() => {
    if (isResendActive) {
      return;
    }

    startTimer();
  }, [isResendActive]);

  const { params } = route;
  const userInfo = params?.userInfo;

  const handleCode = (item: any) => {
    if (item === "del") {
      setCode((prevCode) => prevCode.slice(0, prevCode.length - 1));
    } else if (typeof Number(item) === "number") {
      if (code.length === 6) return;
      setCode((prevCode) => [...prevCode, item]);
    }
  };

  const startTimer = () => {
    const timerInterval = setInterval(() => {
      setTimer((previousTimer) => {
        if (previousTimer === 0) {
          setIsResendActive(true);
          clearInterval(timerInterval);
          return 0;
        }
        return previousTimer - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    setTimer(10);
    setIsResendActive(false);
    startTimer();
  };

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const resendOTP = async () => {
    try {
      const data = await UserService.resendVerificationTokenApi(userInfo!.user._id);
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: () => resetTimer(),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const submitToken = async () => {
    try {
      setLoading(true);

      const token = code.join("");
      const data = await UserService.sendVerificationTokenApi({
        userId: userInfo!.user._id,
        token: token.toString(),
      });

      Alert.alert("Success", data.message, [
        {
          text: "OK",
          onPress: () => goToSignIn(),
        },
      ]);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setCode([]);
      Alert.alert("Error", error.message, [
        {
          text: "Try again",
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <BWFadeInContainer>
        <View style={styles.content}>
          <Text style={styles.title}>Fill in the token we sent you through email !</Text>
          <View style={styles.pinContainer}>
            {[...Array(PIN_LENGTH).keys()].map((i, index) => {
              const isSelected = !!code[i];
              return (
                <MotiView
                  key={index}
                  style={[styles.pinCircle]}
                  animate={{ height: isSelected ? 40 : 3, marginBottom: isSelected ? 10 : 0 }}
                  transition={{ type: "timing", duration: 200 }}
                />
              );
            })}
          </View>
          <FlatList
            scrollEnabled={false}
            numColumns={3}
            data={DIAL_PAD}
            columnWrapperStyle={styles.listWrapper}
            contentContainerStyle={styles.listWrapper}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <DialButton onPress={(item) => handleCode(item)} dial={item.toString()} />
            )}
          />
          <BWButton
            loading={loading}
            disabled={code.length < 6}
            onPress={submitToken}
            title="Submit"
            style={styles.submitOTPBtn}
          />

          <View style={styles.resendOtpContainer}>
            {timer > 0 && <Text style={styles.timer}>{timer} sec.</Text>}
            <BWButton onPress={resendOTP} title="Re-send OTP" link disabled={!isResendActive} />
          </View>
        </View>
      </BWFadeInContainer>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;

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
    opacity: 0.5,
  },
  title: {
    fontFamily: "MinomuBold",
    fontSize: 28,
    color: COLORS.MUTED[50],
  },
  resendOtpContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 20,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Minomu",
    color: COLORS.WARNING[500],
  },
  timer: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "MinomuBold",
    color: COLORS.WARNING[500],
  },
  content: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    gap: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pinContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 60,
    alignItems: "flex-end",
  },
  pinCircle: {
    width: 40,
    borderRadius: 50,
    backgroundColor: COLORS.WARNING[500],
  },
  listWrapper: {
    gap: 20,
  },

  dialBtn: {
    width: 80,
    height: 80,
  },
  dialBtnLabel: {
    fontFamily: "Minomu",
    fontSize: 24,
  },

  submitOTPBtn: {
    width: "100%",
    height: 50,
  },
});
