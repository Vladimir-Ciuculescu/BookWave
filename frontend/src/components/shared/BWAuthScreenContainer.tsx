import { NavigationProp } from "@react-navigation/native";
import React, { ReactNode, useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StackNavigatorProps } from "types/interfaces/navigation";

const { width, height } = Dimensions.get("window");

interface BWAuthScreenContainerProps {
  navigation: NavigationProp<StackNavigatorProps>;
  children: ReactNode;
  image: string;
}

const BWAuthScreenContainer: React.FC<BWAuthScreenContainerProps> = ({
  children,
  navigation,
  image,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    navigation.addListener("focus", () => {
      opacity.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) });
      scale.value = withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.quad) });
    });

    navigation.addListener("blur", () => {
      opacity.value = 0;
      scale.value = 1;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        style={[styles.background, imageStyle]}
        source={{
          uri: image,
        }}
        resizeMode="cover"
      />
      {children}
    </SafeAreaView>
  );
};

export default BWAuthScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
});
