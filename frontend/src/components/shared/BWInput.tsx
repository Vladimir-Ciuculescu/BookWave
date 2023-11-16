import { useEffect } from "react";
import { useFormikContext } from "formik";
import { TextInputProps, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "utils/colors";
import { Text, TextField } from "react-native-ui-lib";

interface BWInputProps extends TextInputProps {
  name: string;
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightIcon?: any;
  placeholderTextColor?: string;
  label?: string;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  enablerError?: boolean;
  placeholder?: string;
}

const BWInput: React.FC<BWInputProps> = (props) => {
  const {
    name,
    label,
    multiline,
    numberOfLines,
    autoCapitalize,
    style,
    inputStyle,
    enablerError,
    placeholder,
  } = props;

  const { handleChange, errors, values, handleBlur, touched } = useFormikContext<{
    [key: string]: string;
  }>();

  const errorMessage = errors[name];
  const isTouched = touched[name];

  // ? Hooks
  const xOffSet = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xOffSet.value }],
    };
  });

  useEffect(() => {
    if (errorMessage && isTouched) {
      shakeInput();
    }
  }, [errorMessage, isTouched]);

  // ? Functions
  const shakeInput = () => {
    xOffSet.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withSpring(0, { damping: 8, mass: 0.5, stiffness: 1000, restDisplacementThreshold: 0.1 }),
    );
  };

  return (
    <Animated.View style={[animatedStyle, styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextField
        placeholder={placeholder}
        placeholderTextColor={COLORS.MUTED[500]}
        autoCapitalize={autoCapitalize || "sentences"}
        textContentType="oneTimeCode"
        style={[styles.input, multiline ? styles.multiLine : null, inputStyle]}
        multiline={multiline || false}
        numberOfLines={numberOfLines || undefined}
        value={values[name]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        enableErrors={enablerError || false}
        validationMessage={isTouched && errorMessage ? errorMessage : ""}
        validationMessageStyle={styles.errorMessage}
      />
    </Animated.View>
  );
};

export default BWInput;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  label: {
    color: COLORS.MUTED[50],
    fontSize: 24,
    fontFamily: "MinomuBold",
  },

  input: {
    backgroundColor: COLORS.DARK[200],
    minHeight: 50,
    borderRadius: 16,
    color: COLORS.MUTED[50],
    textAlignVertical: "top",
    fontFamily: "Minomu",
    paddingHorizontal: 20,
  },

  multiLine: {
    paddingTop: 16,
    paddingBottom: 16,
  },

  errorMessage: {
    color: COLORS.DANGER[500],
    fontFamily: "Minomu",
    top: 10,
  },
});
