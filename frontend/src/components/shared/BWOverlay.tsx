import { Portal } from "@gorhom/portal";
import { Text, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";

const OverlayView = () => {
  return (
    <View style={styles.overlay}>
      <Text style={styles.overlayText}>This is content over the bottom tab navigator</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  //   overlay: {
  //     backgroundColor: "rgba(0, 0, 0, 0.5)",
  //     padding: 16,
  //     alignItems: "center",
  //   },
  //   overlayText: {
  //     color: "white",
  //     fontWeight: "bold",
  //   },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OverlayView;
