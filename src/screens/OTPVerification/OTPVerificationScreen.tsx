import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, SafeAreaView, StyleSheet } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import UserService from "api/users.api";
import BWButton from "components/shared/BWButton";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import BWView from "components/shared/BWView";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { Button, Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";

const { width, height } = Dimensions.get("window");

const PIN_LENGTH = 6;
const DIAL_PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];

interface DialButtonProps {
  dial: string;
  onPress: (item: any) => void;
  disabled: boolean;
}

const DialButton: React.FC<DialButtonProps> = ({ dial, onPress, disabled }) => {
  return (
    <Button
      onPress={() => onPress(dial)}
      disabled={disabled}
      disabledBackgroundColor={COLORS.VIOLET[500]}
      style={[styles.dialBtn, { opacity: dial === "" ? 0 : 1 }]}
      label={dial !== "del" ? dial : undefined}
      round
      labelStyle={styles.dialBtnLabel}
      //@ts-ignore
      iconSource={() => (dial === "del" ? <Feather name="delete" size={24} color={COLORS.MUTED[50]} /> : null)}
    />
  );
};

interface OTPVerification {
  navigation: NavigationProp<StackNavigatorProps, "OTPVerification", undefined>;
  route: RouteProp<StackNavigatorProps, "OTPVerification">;
}

const OTPVerificationScreen: React.FC<OTPVerification> = ({ navigation, route }) => {
  const {
    params: { userId, isLoggedIn },
  } = route;
  // const userInfo = params?.userInfo;

  // ? Hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(10);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isResendActive) {
      return;
    }

    startTimer();
  }, [isResendActive]);

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

  const goNext = () => {
    navigation.navigate(isLoggedIn ? "App" : "Login");
  };

  const resendOTP = async () => {
    try {
      await UserService.resendVerificationTokenApi(userId);
      setIsResendActive(false);
      setTimer(10);

      Alert.alert("Success", "Please check your email !", [
        {
          text: "OK",
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
        userId: userId,
        token: token.toString(),
      });

      Alert.alert("Success", data.message, [
        {
          text: "OK",
          onPress: () => goNext(),
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

  const logOut = async () => {
    await UserService.logOutApi({ fromAll: "no" });
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
    dispatch(
      setProfileAction({
        id: "",
        name: "",
        email: "",
        verified: false,
        avatar: "",
        followers: 0,
        followings: 0,
      }),
    );
    dispatch(setLoggedInAction(false));
  };

  const isDialBtnDisabled = (dial: string | number) =>
    (typeof dial === "number" && code.length === 6) || (dial === "del" && code.length === 0) ? true : false;

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
            renderItem={({ item }) => <DialButton disabled={isDialBtnDisabled(item)} onPress={(item) => handleCode(item)} dial={item.toString()} />}
          />
          <BWButton loading={loading} disabled={code.length < 6} onPress={submitToken} title="Submit" style={styles.submitOTPBtn} />

          <BWView row justifyContent="space-between" style={{ width: "100%" }}>
            <View style={styles.resendOtpContainer}>
              {timer > 0 && <Text style={styles.timer}>{timer} sec.</Text>}
              <BWButton onPress={resendOTP} title="Re-send OTP" link disabled={!isResendActive} />
            </View>
            {isLoggedIn && <BWButton onPress={logOut} title="Log out" link />}
          </BWView>
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
    //backgroundColor: COLORS.VIOLET[700],
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
