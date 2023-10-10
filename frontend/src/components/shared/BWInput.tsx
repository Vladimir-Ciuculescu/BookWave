import React from "react";
import { TextInputProps, StyleSheet } from "react-native";
import { TextField } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface BWInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize: TextInputProps["autoCapitalize"];
  value: string;
  onChangeText: (e: string) => void;
}

const BWInput: React.FC<BWInputProps> = (props) => {
  const { placeholder, secureTextEntry, autoCapitalize, value, onChangeText } = props;

  return (
    <TextField
      {...props}
      autoCapitalize={autoCapitalize || "sentences"}
      secureTextEntry={secureTextEntry || false}
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.MUTED[300]}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default BWInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.MUTED[300],
  },
});
