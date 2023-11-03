import { ReactNode, useEffect } from "react";
import { Pressable, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS } from "utils/colors";

const { width, height } = Dimensions.get("screen");

interface BWBottomSheetProps {
  children: ReactNode;
  visible: boolean;
  onPressOut: () => void;
}

const BWBottomSheet: React.FC<BWBottomSheetProps> = ({ children, visible, onPressOut }) => {
  useEffect(() => {
    offsetY.value = withSpring(0);
  }, [visible]);

  const offsetY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  const bottomSheetGesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY > 0) {
        offsetY.value += event.changeY;
      }
    })
    .onFinalize((event) => {
      if (event.translationY > 200) {
        runOnJS(onPressOut)();
      } else {
        offsetY.value = withSpring(0);
      }
    });

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (!visible) {
    return null;
  }

  return (
    <>
      <AnimatedPressable
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.backdrop}
        onPress={onPressOut}
      ></AnimatedPressable>
      <GestureDetector gesture={bottomSheetGesture}>
        <Animated.View
          exiting={SlideOutDown}
          entering={SlideInDown.springify().damping(15)}
          style={[styles.sheet, animatedStyle]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  sheet: {
    backgroundColor: COLORS.DARK[200],
    padding: 32,
    height: height / 1.5,
    width: width,
    position: "absolute",
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
});

export default BWBottomSheet;
