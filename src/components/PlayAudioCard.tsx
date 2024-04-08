import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setSelectedAudioAction, toggleOptionBottomSheetsAction } from "redux/reducers/audio-actions.reducer";
import { setVisibileModalPlayerAction } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import { convertFromSecondsToClock } from "utils/math";
import SoundWave from "./SoundWave";
import BWIconButton from "./shared/BWIconButton";
import BWImage from "./shared/BWImage";
import BWPressable from "./shared/BWPressable";
import BWView from "./shared/BWView";

interface PlayAudioCardProps {
  audio: AudioFile;
  onPress: () => void;
  onLongPress?: () => void;
  onSelect: () => void;

  isPlaying: boolean;
}

const PlayAudioCard: React.FC<PlayAudioCardProps> = ({ audio, onPress, isPlaying, onSelect }) => {
  const dispatch = useDispatch();

  const openAudioPlayer = async () => {
    dispatch(setVisibileModalPlayerAction(true));
    dispatch(setSelectedAudioAction(audio));
    onSelect();
  };

  const openAudioActions = () => {
    dispatch(toggleOptionBottomSheetsAction(true));
    dispatch(setSelectedAudioAction(audio));
  };

  return (
    <BWPressable onPress={openAudioPlayer}>
      <BWView row justifyContent="space-between" alignItems="center" style={{ height: 80 }}>
        <BWView row gap={20}>
          <View style={styles.imageContainer}>
            {isPlaying && <SoundWave />}
            <BWImage style={styles.image} placeholder={!audio.poster} iconName="image" src={audio.poster!} />
          </View>
          <BWView column style={{ height: "100%" }} justifyContent="space-evenly">
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.audioTitle}>
              {audio.title}
            </Text>
            <BWView row>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.audioDescription}>
                {audio.about}
              </Text>
              <Text style={styles.audioDuration}> | {convertFromSecondsToClock(audio.duration)}</Text>
            </BWView>
          </BWView>
        </BWView>
        <BWView row gap={20}>
          <BWIconButton
            onPress={onPress}
            style={styles.playBtn}
            icon={() => (isPlaying ? <FontAwesome name="pause" size={16} color="black" /> : <Ionicons name="md-play" size={16} color="black" />)}
          />
          <BWIconButton link onPress={openAudioActions} icon={() => <Entypo name="dots-three-vertical" size={16} color={COLORS.MUTED[50]} />} />
        </BWView>
      </BWView>
    </BWPressable>
  );
};

export default memo(PlayAudioCard);

const styles = StyleSheet.create({
  imageContainer: {
    height: 80,
    width: 80,
    borderRadius: 24,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },

  audioTitle: {
    color: COLORS.MUTED[50],
    fontSize: 18,
    fontFamily: "MinomuBold",
    maxWidth: 180,
  },

  audioDescription: {
    maxWidth: 100,
    color: COLORS.MUTED[500],
    fontFamily: "Minomu",
    fontSize: 14,
  },

  audioDuration: {
    color: COLORS.MUTED[500],
    fontFamily: "Minomu",
    fontSize: 14,
  },

  playBtn: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: COLORS.WARNING[500],
  },
});
