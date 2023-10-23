import React from "react";
import { StyleSheet, ViewStyle, ActivityIndicator } from "react-native";

import { Button } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface BWButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  link?: boolean;
  loading?: boolean;
}

const BWButton: React.FC<BWButtonProps> = ({ title, style, onPress, disabled, link, loading }) => {
  return (
    <Button
      link={link || false}
      disabled={disabled}
      label={loading ? undefined : title}
      iconSource={
        loading ? () => <ActivityIndicator size="small" color={COLORS.MUTED[50]} /> : null
      }
      onPress={onPress}
      labelStyle={styles.signUpLabel}
      style={[link ? null : styles.contained, style, disabled || loading ? styles.disabled : null]}
    />
  );
};

export default BWButton;

const styles = StyleSheet.create({
  signUpBtn: {
    width: 160,
    borderRadius: 14,
    height: 50,
  },
  contained: {
    backgroundColor: COLORS.WARNING[500],
    color: COLORS.MUTED[50],
    width: 160,
    borderRadius: 14,
    height: 50,
  },

  signUpLabel: {
    fontFamily: "Minomu",
    fontSize: 16,
    color: COLORS.MUTED[50],
  },

  disabled: {
    backgroundColor: COLORS.WARNING[200],
  },
});
