import { ImageStyle, StyleSheet } from "react-native";
import { AnimatedImage, View } from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "utils/colors";

interface BWImageProps {
  placeholder?: boolean;
  style?: ImageStyle;
  src: string;
  backgroundColor?: string;
  iconColor?: string;
  iconSize?: number;
}

const BWImage: React.FC<BWImageProps> = ({
  placeholder,
  style,
  src,
  backgroundColor,
  iconColor,
  iconSize,
}) => {
  if (placeholder) {
    return (
      <View
        style={[
          style,
          styles.placeholder,
          { backgroundColor: backgroundColor || COLORS.WARNING[500] },
        ]}
      >
        <FontAwesome name="image" size={iconSize || 50} color={iconColor || COLORS.MUTED[200]} />
      </View>
    );
  }

  return <AnimatedImage source={{ uri: src }} style={style} />;
};

export default BWImage;

const styles = StyleSheet.create({
  placeholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
