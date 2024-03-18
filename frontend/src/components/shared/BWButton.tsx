import React from "react";
import { ActivityIndicator, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { Button } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface BWButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle;
  disabled?: boolean;
  link?: boolean;
  loading?: boolean;
  iconSource?: any;
  iconOnRight?: boolean;
}

const BWButton: React.FC<BWButtonProps> = ({ title, style, labelStyle, onPress, disabled, link, loading, iconSource, iconOnRight }, ref) => {
  return (
    <Button
      ref={ref}
      link={link || false}
      disabled={disabled || loading}
      label={loading ? undefined : title}
      iconSource={loading ? () => <ActivityIndicator size="small" color={COLORS.MUTED[50]} /> : iconSource ? iconSource : null}
      iconOnRight={iconOnRight}
      onPress={onPress}
      labelStyle={[
        link ? styles.linkLabel : null,
        disabled ? styles.disabled : styles.enabled,
        styles.btnLabel,
        labelStyle,
        title && iconSource && { paddingLeft: 7 },
      ]}
      style={[link ? styles.link : styles.contained, disabled || loading ? styles.disabled : styles.enabled, styles.btn, style]}
    />
  );
};

export default BWButton;

const styles = StyleSheet.create({
  signUpBtn: {
    width: 160,
    borderRadius: 14,
    height: 50,
    fontFamily: "Minomu",
    fontSize: 16,
  },

  btn: {
    borderRadius: 14,
    width: "auto",
  },

  btnLabel: {
    fontFamily: "Minomu",
    fontSize: 16,
  },

  contained: {
    backgroundColor: COLORS.WARNING[500],
    color: COLORS.MUTED[50],
    borderRadius: 14,
  },

  link: {
    backgroundColor: "transparent",
    color: COLORS.WARNING[500],
  },

  linkLabel: {
    color: COLORS.WARNING[500],
  },

  enabled: {
    opacity: 1,
  },

  disabled: {
    opacity: 0.5,
  },
});
