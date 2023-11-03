import { useFormikContext } from "formik";
import React from "react";

import BWButton from "./BWButton";
import { ViewStyle } from "react-native";

interface BWSubmitButtonProps {
  title: string;
  style?: ViewStyle;
  loading?: boolean;
}

const BWSubmitButton: React.FC<BWSubmitButtonProps> = ({ title, style, loading }) => {
  const { handleSubmit, values } = useFormikContext();

  console.log(values);

  return <BWButton title={title} onPress={handleSubmit} style={style!} loading={loading} />;
};

export default BWSubmitButton;
