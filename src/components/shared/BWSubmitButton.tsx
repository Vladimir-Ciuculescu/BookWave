import { useFormikContext } from "formik";
import React from "react";

import BWButton from "./BWButton";
import { ViewStyle, StyleSheet, StyleProp } from "react-native";

interface BWSubmitButtonProps {
  title: string;
  style?: ViewStyle | ViewStyle[];
  loading?: boolean;
  full?: boolean;
  disabled?: boolean;
}

const BWSubmitButton: React.FC<BWSubmitButtonProps> = ({
  title,
  style,
  loading,
  full,
  disabled,
}) => {
  const { handleSubmit, resetForm, isValid, validationSchema, touched } = useFormikContext();

  return (
    <BWButton
      disabled={disabled || false}
      title={title}
      onPress={handleSubmit}
      //@ts-ignore
      style={[!full && styles.button, styles.defaultBtn, style!]}
      loading={loading}
    />
  );
};

export default BWSubmitButton;

const styles = StyleSheet.create({
  button: {
    width: 160,
    //height: 50,
  },
  defaultBtn: {
    height: 50,
  },
});
