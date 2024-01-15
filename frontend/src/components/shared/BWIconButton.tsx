import React from "react";
import { ViewStyle, StyleSheet } from "react-native";
import { Button } from "react-native-ui-lib";

interface IconButtonProps {
  icon: any;
  style?: ViewStyle;
  onPress: (e?: any) => void;
  link?: boolean;
  disabled?: boolean;
}

const BWIconButton: React.FC<IconButtonProps> = ({ icon, style, onPress, link, disabled }) => {
  return (
    <Button
      style={[style, disabled ? styles.disabled : styles.enabled]}
      iconSource={icon}
      onPress={onPress}
      link={link}
      disabled={disabled || false}
    />
  );
};

export default BWIconButton;

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.3,
  },

  enabled: {
    opacity: 1,
  },
});
