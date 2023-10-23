import { useIsFocused } from "@react-navigation/native";
import React, { ReactNode, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface BWFadeInContainerProps {
  children: ReactNode;
}

const BWFadeInContainer: React.FC<BWFadeInContainerProps> = ({ children }) => {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-25);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      });
      translateY.value = withTiming(0, {
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      });
    } else {
      opacity.value = 0;
      translateY.value = -25;
    }
  }, [isFocused]);

  return <Animated.View style={[animatedStyle, { flex: 1 }]}>{children}</Animated.View>;
};

export default BWFadeInContainer;
