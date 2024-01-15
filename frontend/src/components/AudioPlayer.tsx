import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActionSheet, Dialog, PanningProvider, Text, View } from "react-native-ui-lib";
import {
  playerSelector,
  setDidFinishAction,
  setIsPlayingAction,
  setVisibileModalPlayerAction,
} from "redux/reducers/player.reducer";
import { COLORS } from "utils/colors";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";
import BWDivider from "./shared/BWDivider";
import { formatToClock } from "utils/math";
import Slider from "@react-native-community/slider";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import BWIconButton from "./shared/BWIconButton";
import { AudioFile } from "types/interfaces/audios";
import { loadAudio } from "utils/audio";

const { height, width } = Dimensions.get("screen");

const AudioPlayerContent = () => {
  const { track, audio, progress, duration, isPlaying, didFinish, list, isFavorite } =
    useSelector(playerSelector);

  const [progressValue, setProgressValue] = useState(progress);
  const [speedModal, toggleSpeedModal] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgressValue((prevValue: number) => prevValue + 500);
    }, 500);

    if (!isPlaying) {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [duration, isPlaying]);

  const seekTimeStamp = async (milliSeconds: number) => {
    await track?.setPositionAsync(milliSeconds);
  };

  const skipTo = async (direction: "backward" | "forwnard") => {
    await track?.setPositionAsync(
      direction === "backward" ? progress - 10 * 1000 : progress + 10 * 1000,
    );
    setProgressValue((prevValue) =>
      direction === "backward" ? prevValue - 10 * 1000 : prevValue + 10 * 1000,
    );
  };

  const findAudioIndex = (list: AudioFile[], audio: AudioFile) => {
    const index = list.findIndex((item: AudioFile) => item === audio);

    return index;
  };

  const stepBackWard = async () => {
    const currentIndex = findAudioIndex(list, audio!);

    await loadAudio(dispatch, list[currentIndex - 1]);

    setProgressValue(0);
  };

  const stepForward = async () => {
    const currentIndex = findAudioIndex(list, audio!);

    await loadAudio(dispatch, list[currentIndex + 1]);

    setProgressValue(0);
  };

  const toggleIsPlaying = async () => {
    dispatch(setIsPlayingAction(!isPlaying));

    if (isPlaying) {
      await track?.pauseAsync();
    } else {
      if (didFinish) {
        setProgressValue(0);
        await track?.replayAsync();
        dispatch(setDidFinishAction(false));
      } else {
        await track?.playAsync();
      }
    }
  };

  const isFirstInList = findAudioIndex(list, audio!) === 0;

  const isLastInList = findAudioIndex(list, audio!) === list.length - 1;

  return (
    <View style={{ backgroundColor: COLORS.MUTED[800], height: "110%", paddingTop: 40 }}>
      <BWView column alignItems="center" gap={16} style={{ paddingHorizontal: 20 }}>
        <BWImage
          src={audio?.poster}
          style={{ width: width * 0.75, height: width * 0.75, borderRadius: 20 }}
          placeholder={!audio?.poster}
          iconName="image"
        />
        <BWView column alignItems="center" gap={8}>
          <Text style={{ color: COLORS.MUTED[50], fontSize: 24, fontFamily: "MinomuBold" }}>
            {audio?.title}
          </Text>
          <Text style={{ color: COLORS.MUTED[300], fontSize: 24, fontFamily: "Minomu" }}>
            {audio?.about}
          </Text>
        </BWView>
        <BWDivider
          orientation="horizontal"
          thickness={1.2}
          width="100%"
          color={COLORS.MUTED[700]}
        />
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          step={1000}
          maximumValue={duration}
          value={progressValue}
          onValueChange={(e) => setProgressValue(e)}
          onSlidingComplete={seekTimeStamp}
          minimumTrackTintColor={COLORS.WARNING[500]}
          maximumTrackTintColor={COLORS.WARNING[500]}
          thumbTintColor={COLORS.WARNING[600]}
        />
        <BWView style={{ width: "100%" }} row justifyContent="space-between">
          <Text style={{ color: "white" }}>{formatToClock(progress)} </Text>
          <Text style={{ color: "white" }}>{formatToClock(duration)}</Text>
        </BWView>
        <BWView row style={{ width: "100%" }} justifyContent="space-between" alignItems="center">
          <BWIconButton
            link
            icon={() => <AntDesign name="stepbackward" size={30} color={COLORS.MUTED[50]} />}
            onPress={stepBackWard}
            disabled={isFirstInList}
          />
          <BWIconButton
            link
            icon={() => <MaterialIcons name="replay-10" size={40} color={COLORS.MUTED[50]} />}
            onPress={() => skipTo("backward")}
          />
          <BWIconButton
            style={{ width: 50, height: 50, backgroundColor: COLORS.WARNING[500], paddingLeft: 4 }}
            icon={() =>
              isPlaying ? (
                <Ionicons name="pause" size={24} color={COLORS.MUTED[50]} />
              ) : (
                <FontAwesome5 name="play" size={24} color={COLORS.MUTED[50]} />
              )
            }
            onPress={toggleIsPlaying}
          />
          <BWIconButton
            link
            icon={() => <MaterialIcons name="forward-10" size={40} color={COLORS.MUTED[50]} />}
            onPress={() => skipTo("forwnard")}
          />

          <BWIconButton
            link
            icon={() => <AntDesign name="stepforward" size={30} color={COLORS.MUTED[50]} />}
            onPress={stepForward}
            disabled={isLastInList}
          />
        </BWView>
        <BWView row gap={50} style={{ marginTop: 30 }}>
          <BWIconButton
            link
            icon={() => <AntDesign name="heart" size={30} color={COLORS.MUTED[50]} />}
            // onPress={stepBackWard}
            onPress={() => {}}
            disabled={isFirstInList}
          />
          <BWIconButton
            link
            icon={() => <MaterialIcons name="speed" size={30} color={COLORS.MUTED[50]} />}
            // onPress={() => skipTo("backward")}
            onPress={() => toggleSpeedModal(true)}
          />
        </BWView>
      </BWView>
      <Dialog
        visible={speedModal}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={{ backgroundColor: COLORS.MUTED[900], height: 100, borderRadius: 10 }}
        useSafeArea
        onDismiss={() => toggleSpeedModal(false)}
      >
        <Text text60>Content</Text>
      </Dialog>
    </View>
  );
};

const Title = () => null;

const AudioPlayer: React.FC<any> = () => {
  const { visibleModalPlayer } = useSelector(playerSelector);

  const dispatch = useDispatch();

  const closeModalPlayer = () => {
    dispatch(setVisibileModalPlayerAction(false));
  };

  return (
    <ActionSheet
      containerStyle={{ height: height * 0.85, borderRadius: 10 }}
      dialogStyle={{ borderRadius: 20 }}
      visible={visibleModalPlayer}
      title={"Title"}
      onDismiss={closeModalPlayer}
      cancelButtonIndex={3}
      destructiveButtonIndex={0}
      options={[{ label: "", onPress: () => {} }]}
      renderAction={() => <AudioPlayerContent />}
      renderTitle={() => <Title />}
    />
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  track: {
    height: 8,
    color: "red",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 13,
    borderColor: COLORS.WARNING[600],
    borderWidth: 1,
  },
  activeThumb: {
    width: 40,

    height: 40,
    borderRadius: 20,
    borderColor: "yellow",
    borderWidth: 2,
  },
});
