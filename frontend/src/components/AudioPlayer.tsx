import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import useAudioController from "hooks/useAudioController";
import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import TrackPlayer, { useActiveTrack, useProgress } from "react-native-track-player";
import { ActionSheet, Dialog, PanningProvider, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { playerSelector, setAudioAction, setVisibileModalPlayerAction } from "redux/reducers/player.reducer";
import { COLORS } from "utils/colors";
import { convertFromSecondsToClock } from "utils/math";
import BWDivider from "./shared/BWDivider";
import BWIconButton from "./shared/BWIconButton";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";

const { height, width } = Dimensions.get("screen");

const AudioPlayerContent = () => {
  const [speedModal, toggleSpeedModal] = useState<boolean>(false);
  const { audio, list } = useSelector(playerSelector);
  const { position, duration } = useProgress(300);
  const { isPlaying, onAudioPress, skipTo } = useAudioController();
  const track = useActiveTrack();
  const dispatch = useDispatch();

  const stepTimestamp = async (direction: "backward" | "forward") => {
    await skipTo(direction === "backward" ? -10 : 10);
  };

  const seekTimeStamp = async (second: number) => {
    await TrackPlayer.seekTo(second);
  };

  const stepBackWard = async () => {
    const currentList = await TrackPlayer.getQueue();

    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex === null) {
      return;
    }

    const previousTrack = currentList[currentIndex! - 1];

    if (previousTrack) {
      await TrackPlayer.skipToPrevious();
      dispatch(setAudioAction(list[currentIndex! - 1]));
    }
  };

  const stepForward = async () => {
    const currentList = await TrackPlayer.getQueue();

    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex === null) {
      return;
    }

    const nextTrack = currentList[currentIndex! + 1];

    if (nextTrack) {
      await TrackPlayer.skipToNext();
      dispatch(setAudioAction(list[currentIndex! + 1]));
    }
  };

  const findTrackIndex = (data: any[], track: any) => {
    const trackIndex = data.findIndex((audio) => audio.id === track.id);
    return trackIndex;
  };

  const isLastTrack = track ? findTrackIndex(list, audio) === list.length - 1 : false;

  const isFirstTrack = track ? findTrackIndex(list, audio) === 0 : false;

  return (
    <View style={{ backgroundColor: COLORS.MUTED[800], height: "110%", paddingTop: 40 }}>
      <BWView column alignItems="center" gap={16} style={{ paddingHorizontal: 20 }}>
        <BWImage src={audio?.poster} style={{ width: width * 0.75, height: width * 0.75, borderRadius: 20 }} placeholder={!audio?.poster} iconName="image" />
        <BWView column alignItems="center" gap={8}>
          <Text style={{ color: COLORS.MUTED[50], fontSize: 24, fontFamily: "MinomuBold" }}>{audio?.title}</Text>
          <Text style={{ color: COLORS.MUTED[300], fontSize: 24, fontFamily: "Minomu" }}>{audio?.about}</Text>
        </BWView>
        <BWDivider orientation="horizontal" thickness={1.2} width="100%" color={COLORS.MUTED[700]} />
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          step={1000}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekTimeStamp}
          minimumTrackTintColor={COLORS.WARNING[500]}
          maximumTrackTintColor={COLORS.WARNING[500]}
          thumbTintColor={COLORS.WARNING[600]}
        />
        <BWView style={{ width: "100%" }} row justifyContent="space-between">
          <Text style={{ color: "white" }}>{convertFromSecondsToClock(position)} </Text>
          <Text style={{ color: "white" }}>{convertFromSecondsToClock(duration)} </Text>
        </BWView>
        <BWView row style={{ width: "100%" }} justifyContent="space-between" alignItems="center">
          <BWIconButton link icon={() => <AntDesign name="stepbackward" size={30} color={COLORS.MUTED[50]} />} onPress={stepBackWard} disabled={isFirstTrack} />
          <BWIconButton link icon={() => <MaterialIcons name="replay-10" size={40} color={COLORS.MUTED[50]} />} onPress={() => stepTimestamp("backward")} />
          <BWIconButton
            style={{ width: 50, height: 50, backgroundColor: COLORS.WARNING[500], paddingLeft: 4 }}
            icon={() =>
              isPlaying ? <Ionicons name="pause" size={24} color={COLORS.MUTED[50]} /> : <FontAwesome5 name="play" size={24} color={COLORS.MUTED[50]} />
            }
            onPress={() => onAudioPress(audio!, list)}
          />
          <BWIconButton link icon={() => <MaterialIcons name="forward-10" size={40} color={COLORS.MUTED[50]} />} onPress={() => stepTimestamp("forward")} />

          <BWIconButton link icon={() => <AntDesign name="stepforward" size={30} color={COLORS.MUTED[50]} />} onPress={stepForward} disabled={isLastTrack} />
        </BWView>
        <BWView row gap={50} style={{ marginTop: 30 }}>
          <BWIconButton link icon={() => <AntDesign name="heart" size={30} color={COLORS.MUTED[50]} />} onPress={() => {}} />
          <BWIconButton link icon={() => <MaterialIcons name="speed" size={30} color={COLORS.MUTED[50]} />} onPress={() => toggleSpeedModal(true)} />
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
