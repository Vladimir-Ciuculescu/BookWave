import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

interface BWPressableProps {
  children: ReactNode;
  onPress: Function;
}

const BWPressable: React.FC<BWPressableProps> = ({ children, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}
    >
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
