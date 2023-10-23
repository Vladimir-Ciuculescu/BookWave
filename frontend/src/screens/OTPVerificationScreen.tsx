import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button, Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import BWButton from "components/shared/BWButton";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigatorProps } from "types/interfaces/stack-navigator";
import BWFadeInContainer from "components/shared/BWFadeInContainer";
import { sendVerificationTokenApi } from "api/users-api";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(60);

  useEffect(() => {
    setInterval(() => {
      setTimer((oldTimer) => oldTimer - 1);
    }, 1000);
  }, []);

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

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  const submitToken = async () => {
    setLoading(true);

    const token = code.join("");
    const data = await sendVerificationTokenApi({
      userId: userInfo!.user._id,
      token: token.toString(),
    });

    if (data.error) {
      setErrorMessage(data.error);
      setLoading(false);
      setCode([]);
      Alert.alert("Error", data.error, [
        {
          text: "Try again",
        },
      ]);
      return;
    }

    Alert.alert("Success", data.message, [
      {
        text: "OK",
        onPress: () => goToSignIn(),
      },
    ]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
            style={styles.submitBtn}
          />

          <View style={{ width: "100%" }}>
            <Text style={styles.subtitle}>Re-send OTP</Text>
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
  },

  subtitle: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Minomu",
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
  submitBtn: {
    width: "100%",
  },
});
