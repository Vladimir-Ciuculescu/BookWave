import React from "react";
import { ViewStyle } from "react-native";
import { Button } from "react-native-ui-lib";

interface IconButtonProps {
  icon: any;
  style?: ViewStyle;
  onPress: (e?: any) => void;
  link?: boolean;
}

const BWIconButton: React.FC<IconButtonProps> = ({ icon, style, onPress, link }) => {
  return <Button style={[style]} iconSource={icon} onPress={onPress} link={link} />;
};

export default BWIconButton;
