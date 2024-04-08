import { StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface BWDividerProps {
  orientation: "horizontal" | "vertical";
  width: number | string;
  thickness: number;
  color?: string;
}

const BWDivider: React.FC<BWDividerProps> = ({ orientation, width, color, thickness }) => {
  const dividerStyles =
    orientation === "horizontal"
      ? { width: width, height: thickness }
      : { height: width, width: thickness };
  //@ts-ignore
  return <View style={[dividerStyles, { backgroundColor: color || COLORS.DARK[50] }]} />;
};

export default BWDivider;
