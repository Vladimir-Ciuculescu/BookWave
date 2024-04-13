import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { COLORS } from "utils/colors";
import { useEffect, useRef } from "react";

const SoundWave: React.FC<any> = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    setTimeout(() => {
      animationRef.current?.play(0, 100);
    });
  }, []);

  return <LottieView ref={animationRef} autoPlay loop style={styles.container} source={require("../../assets/animations/SoundWave.json")} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKDROP[50],
    zIndex: 9999,
    borderRadius: 14,
  },
});

export default SoundWave;
