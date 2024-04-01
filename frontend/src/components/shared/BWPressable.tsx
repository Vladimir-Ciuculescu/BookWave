import { ReactNode } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface BWPressableProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress: () => void;
  disabled?: boolean;
}

const BWPressable: React.FC<BWPressableProps> = ({ children, onPress, style, disabled }) => {
  return (
    <Pressable disabled={disabled || false} onPress={onPress} style={({ pressed }) => [pressed ? styles.pressed : styles.unpressed, style]}>
      {children}
    </Pressable>
  );
};

export default BWPressable;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },

  unpressed: {
    opacity: 1,
  },
});
