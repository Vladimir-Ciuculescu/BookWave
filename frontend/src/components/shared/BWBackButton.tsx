import React from "react";
import { StyleSheet } from "react-native";
import BWIconButton from "./BWIconButton";
import { COLORS } from "utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { StackNavigatorProps } from "types/interfaces/stack-navigator";

interface BWBackButton {
  navigation: NavigationProp<StackNavigatorProps>;
}

const BWBackButton: React.FC<BWBackButton> = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <BWIconButton
      onPress={goBack}
      style={styles.backBtn}
      icon={() => <Ionicons name="md-arrow-back" size={26} color="black" />}
    />
  );
};

export default BWBackButton;

const styles = StyleSheet.create({
  backBtn: {
    width: 50,
    height: 50,
    top: 15,
    left: 15,
    backgroundColor: COLORS.MUTED[50],
    borderRadius: 14,
  },
});
