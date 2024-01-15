import { Text, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import { MINI_PLAYER_HEIGHT, TAB_BAR_HEIGHT } from "consts/dimensions";
import { COLORS } from "utils/colors";
import BWView from "./shared/BWView";
import { Dimensions } from "react-native";
import BWImage from "./shared/BWImage";
import { useDispatch, useSelector } from "react-redux";
import {
  playerSelector,
  setAudioAction,
  setDidFinishAction,
  setIsPlayingAction,
  setTrackAction,
  setVisibileModalPlayerAction,
} from "redux/reducers/player.reducer";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import BWIconButton from "./shared/BWIconButton";
import { mapRange } from "utils/math";
import BWPressable from "./shared/BWPressable";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOutDown,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width } = Dimensions.get("window");

const MiniPlayer: React.FC<any> = () => {
  const { track, audio, isPlaying, duration, progress, didFinish } = useSelector(playerSelector);

  const dispatch = useDispatch();

  const togglePlaying = async () => {
    dispatch(setIsPlayingAction(!isPlaying));

    if (isPlaying) {
      await track?.pauseAsync();
    } else {
      if (didFinish) {
        await track?.replayAsync();
        dispatch(setDidFinishAction(false));
      } else {
        await track?.playAsync();
      }
    }
  };

  const openAudioPlayer = () => {
    dispatch(setVisibileModalPlayerAction(true));
  };

  const unloadAudio = async () => {
    await track?.unloadAsync();
    dispatch(setTrackAction(undefined));
    dispatch(setAudioAction(undefined));
  };

  return (
    <Animated.View style={[styles.container]} entering={FadeInLeft} exiting={FadeOutRight}>
      <View
        style={[
          {
            width: `${mapRange({
              outputMin: 0,
              outputMax: 100,
              inputMin: 0,
              inputMax: duration,
              inputValue: progress,
            })}%`,
          },
          styles.progress,
        ]}
      />
      <BWPressable onPress={openAudioPlayer}>
        <BWView row justifyContent="space-between" style={styles.innerContainer}>
          <BWView row alignItems="center" gap={15}>
            <BWImage
              src={audio!.poster}
              placeholder={!audio?.poster}
              iconName="image"
              iconSize={30}
              style={styles.poster}
            />
            <BWView column justifyContent="space-between" gap={5}>
              <Text style={styles.title}>{audio!.title}</Text>
              <Text style={styles.owner}>{audio!.owner.name}</Text>
            </BWView>
          </BWView>

          <BWView row alignItems="center" gap={10} style={{ height: "100%" }}>
            <BWIconButton
              style={styles.actionBtn}
              icon={() =>
                isPlaying ? (
                  <Ionicons name="pause" size={24} color={COLORS.WARNING[500]} />
                ) : (
                  <FontAwesome name="play" size={24} color={COLORS.WARNING[500]} />
                )
              }
              onPress={togglePlaying}
            />
            <BWIconButton
              style={styles.actionBtn}
              icon={() => <AntDesign name="close" size={24} color={COLORS.WARNING[500]} />}
              onPress={unloadAudio}
            />
          </BWView>
        </BWView>
      </BWPressable>
    </Animated.View>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: TAB_BAR_HEIGHT - 2,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
    width: width,
    backgroundColor: COLORS.MUTED[800],
    padding: 0,
    justifyContent: "center",
    zIndex: 1,
    borderBottomColor: COLORS.MUTED[600],
    borderBottomWidth: 2,
  },

  innerContainer: {
    paddingHorizontal: 10,
    height: "100%",
  },

  progress: {
    backgroundColor: COLORS.WARNING[700],

    height: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },

  poster: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },

  title: {
    color: COLORS.WARNING[500],
    fontFamily: "MinomuBold",
  },

  owner: {
    color: "white",
    fontFamily: "Minomu",
  },

  actionBtn: {
    height: "100%",
    width: MINI_PLAYER_HEIGHT - 10,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
});
