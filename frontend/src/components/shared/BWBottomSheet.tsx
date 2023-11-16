import { ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet, Dimensions, Keyboard } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "utils/colors";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("screen");

const HEIGHT = height;

interface BWBottomSheetProps {
  children: ReactNode;
  visible: boolean;
  onPressOut: () => void;
  blurBackground?: boolean;
  height?: string | number;
  keyboardOffSet?: number;
}

const BWBottomSheet: React.FC<BWBottomSheetProps> = ({
  children,
  visible,
  onPressOut,
  blurBackground,
  height,
  keyboardOffSet,
}) => {
  const getOffsetValue = (units: number) => {
    return (HEIGHT * units * 10) / 100;
  };

  const offsetY = useSharedValue(keyboardOffSet ? getOffsetValue(keyboardOffSet) : 0);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

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
        if (keyboardOffSet && !keyboardVisible) {
          offsetY.value = withSpring((HEIGHT * keyboardOffSet * 10) / 100);
        } else {
          offsetY.value = withSpring(0);
        }
      }
    });

  useEffect(() => {
    offsetY.value = withSpring(keyboardOffSet ? getOffsetValue(keyboardOffSet) : 0, {
      duration: 2000,
    });

    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    if (keyboardOffSet) {
      Keyboard.addListener("keyboardWillShow", () => {
        setKeyboardVisible(true);
        offsetY.value = withSpring(0);
      });
      Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardVisible(false);
        offsetY.value = withSpring(getOffsetValue(keyboardOffSet));
      });
    }
  }, [visible, keyboardOffSet]);

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (!visible) {
    return null;
  }

  return (
    <>
      <AnimatedPressable
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.backdrop, blurBackground && styles.blur]}
        onPress={onPressOut}
      ></AnimatedPressable>
      <GestureDetector gesture={bottomSheetGesture}>
        <Animated.View
          exiting={SlideOutDown.duration(500)}
          entering={SlideInDown.springify().damping(15)}
          //@ts-ignore
          style={[styles.sheet, animatedStyle, { height: height || "60%" }]}
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
    height: HEIGHT,
    zIndex: 1,
  },

  blur: {
    backgroundColor: COLORS.BACKDROP[50],
  },

  sheet: {
    backgroundColor: COLORS.DARK[200],
    padding: 32,
    alignSelf: "center",
    //height: height / 1.5,
    width: width,
    position: "absolute",
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,

    zIndex: 1,
  },
});

export default BWBottomSheet;
