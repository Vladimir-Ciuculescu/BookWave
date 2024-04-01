import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { StyleSheet, TextInputProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { TextField, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface BWAuthInputProps extends TextInputProps {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize: TextInputProps["autoCapitalize"];
  rightIcon?: any;
  placeholderTextColor?: string;
}

const BWAuthInput: React.FC<BWAuthInputProps> = (props) => {
  const { name, placeholder, secureTextEntry, autoCapitalize, rightIcon, placeholderTextColor } = props;

  const { handleChange, errors, values, handleBlur, touched } = useFormikContext<{
    [key: string]: string;
  }>();

  const errorMessage = errors[name];
  const isTouched = touched[name];

  // ? Hooks
  const xOffSet = useSharedValue(0);

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xOffSet.value }],
    };
  });

  useEffect(() => {
    if (errorMessage) {
      shakeInput();
    }
  }, [errorMessage]);

  // ? Functions
  const shakeInput = () => {
    xOffSet.value = withSequence(withTiming(-10, { duration: 50 }), withSpring(0, { damping: 8, mass: 0.5, stiffness: 1000, restDisplacementThreshold: 0.1 }));
  };

  return (
    <Animated.View style={[inputStyle]}>
      <TextField
        {...props}
        textContentType="oneTimeCode"
        autoCapitalize={autoCapitalize || "sentences"}
        secureTextEntry={secureTextEntry || false}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || COLORS.MUTED[300]}
        value={values[name]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        enableErrors
        validationMessage={isTouched && errorMessage ? errorMessage : ""}
        validationMessageStyle={styles.errorMessage}
        trailingAccessory={<View style={{ position: "absolute", right: 20 }}>{rightIcon}</View>}
      />
    </Animated.View>
  );
};

export default BWAuthInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.MUTED[300],
  },
  errorMessage: {
    color: COLORS.DANGER[500],
  },
});
