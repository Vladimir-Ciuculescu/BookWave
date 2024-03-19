import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { MINI_PLAYER_HEIGHT, TAB_BAR_HEIGHT } from "consts/dimensions";
import useAudioController from "hooks/useAudioController";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import TrackPlayer, { Track, useProgress } from "react-native-track-player";
import { Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAudioAction } from "redux/reducers/audio-actions.reducer";
import { playerSelector, setAudioAction, setVisibileModalPlayerAction } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import { mapRange } from "utils/math";
import BWIconButton from "./shared/BWIconButton";
import BWImage from "./shared/BWImage";
import BWPressable from "./shared/BWPressable";
import BWView from "./shared/BWView";

const { width } = Dimensions.get("window");

interface MiniPlayerProps {
  track: Track;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ track }) => {
  const { audio, list } = useSelector(playerSelector);

  const { isPlaying, onAudioPress } = useAudioController();
  const progress = useProgress(300);

  const dispatch = useDispatch();

  const openAudioPlayer = () => {
    const payload: AudioFile = {
      id: track.id,
      title: track.title!,
      about: track.about,
      //@ts-ignore
      category: track.genre,
      file: track.url,
      poster: track.artwork,
      owner: track.owner,
      duration: track.duration!,
    };
    dispatch(setSelectedAudioAction(payload));
    dispatch(setVisibileModalPlayerAction(true));
  };

  const unloadAudio = async () => {
    await TrackPlayer.reset();

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
              inputMax: progress.duration,
              inputValue: progress.position,
            })}%`,
          },
          styles.progress,
        ]}
      />

      {
        <BWPressable onPress={openAudioPlayer}>
          <BWView row justifyContent="space-between" style={styles.innerContainer}>
            <BWView row alignItems="center" gap={15}>
              <BWImage src={track!.artwork} placeholder={!track?.artwork} iconName="image" iconSize={30} style={styles.poster} />
              <BWView column justifyContent="space-between" gap={5}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                  {track!.title}
                </Text>
                <Text style={styles.owner}>{track!.owner.name}</Text>
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
                onPress={() => onAudioPress(audio!, list)}
              />
              <BWIconButton style={styles.actionBtn} icon={() => <AntDesign name="close" size={24} color={COLORS.WARNING[500]} />} onPress={unloadAudio} />
            </BWView>
          </BWView>
        </BWPressable>
      }
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
    maxWidth: (width - 20) / 2,
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
