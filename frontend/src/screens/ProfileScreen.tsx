import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native";
import { Button, Text } from "react-native-ui-lib";
import { useDispatch } from "react-redux";

const ProfileScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const logOut = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView>
      <Button label="Log out" onPress={logOut} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
