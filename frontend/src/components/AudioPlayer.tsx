import { Dimensions, StyleSheet } from "react-native";
import { ActionSheet, Button, Text, View, Slider } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { playerSelector, setVisibileModalPlayerAction } from "redux/reducers/player.reducer";
import { COLORS } from "utils/colors";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";
import BWDivider from "./shared/BWDivider";
import { formatToClock } from "utils/math";

const { height, width } = Dimensions.get("screen");

const AudioPlayerContent = () => {
  const { track, audio, progress, duration } = useSelector(playerSelector);

  const seekTimeStamp = async (milliSeconds: number) => {
    console.log(milliSeconds);
    await track?.setPositionAsync(milliSeconds);

    //track
  };

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
          <Text style={{ color: COLORS.MUTED[300], fontSize: 20, fontFamily: "Minomu" }}>
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
          migrate
          containerStyle={{ width: "100%" }}
          minimumValue={0}
          maximumValue={duration}
          onTouchStart={() => console.log(111)}
          onTouchEnd={() => console.log(222)}
          value={progress}
          onValueChange={(e) => seekTimeStamp(e)}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          activeThumbStyle={styles.activeThumb}
          thumbTintColor={COLORS.WARNING[600]}
          minimumTrackTintColor={COLORS.WARNING[500]}
          maximumTrackTintColor={COLORS.WARNING[500]}
        />
        <BWView style={{ width: "100%" }} row justifyContent="space-between">
          <Text style={{ color: "white" }}>{formatToClock(progress)}</Text>
          <Text style={{ color: "white" }}>{formatToClock(duration)}</Text>
        </BWView>
      </BWView>
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
      containerStyle={{ height: height * 0.8, borderRadius: 10 }}
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
