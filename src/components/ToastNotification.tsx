import { TOAST_NOTIFICATION_HEIGHT } from "consts/dimensions";
import { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Text } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { ToastNotificationSelector, setToastMessageAction } from "redux/reducers/toast.reducer";
import { COLORS } from "utils/colors";

const { width } = Dimensions.get("screen");

const ToastNotification: React.FC<any> = () => {
  const toastState = useSelector(ToastNotificationSelector);

  const { message, type } = toastState;

  const dispatch = useDispatch();

  const offsetY = useSharedValue(-TOAST_NOTIFICATION_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  const closeToast = () => {
    dispatch(setToastMessageAction({ message: "", type: undefined }));
  };

  useEffect(() => {
    if (message) {
      offsetY.value = withTiming(0);
      const timeOut = setTimeout(() => {
        closeToast();
        clearTimeout(timeOut);
      }, 3000);
    } else {
      offsetY.value = withTiming(-TOAST_NOTIFICATION_HEIGHT);
    }
  }, [message]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.container,
        type === "success" ? styles.success : type === "error" ? styles.error : styles.inherit,
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

export default ToastNotification;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: TOAST_NOTIFICATION_HEIGHT,

    position: "absolute",
    top: 0,
    marginLeft: 50,
    marginRight: 50,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: 20,
  },
  success: {
    backgroundColor: COLORS.SUCCESS[500],
  },
  error: {
    backgroundColor: COLORS.DANGER[500],
  },

  inherit: {
    backgroundColor: "inherit",
  },

  message: {
    fontSize: 16,
    fontFamily: "Minomu",
    color: COLORS.MUTED[50],
  },
});
