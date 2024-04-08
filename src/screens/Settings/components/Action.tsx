import React from "react";
import { Text } from "react-native-ui-lib";
import BWPressable from "components/shared/BWPressable";
import BWView from "components/shared/BWView";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "utils/colors";

interface ActionProps {
  title: string;
  icon: React.JSX.Element;
  onPress: () => void;
}

const Action: React.FC<ActionProps> = ({ title, icon, onPress }) => {
  return (
    <BWPressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <BWView row alignItems="center" gap={15}>
        {icon}
        <Text style={{ color: COLORS.MUTED[50], fontSize: 18, fontFamily: "Minomu" }}>{title}</Text>
      </BWView>
      <MaterialIcons name="keyboard-arrow-right" size={26} color={COLORS.MUTED[50]} />
    </BWPressable>
  );
};

export default Action;
