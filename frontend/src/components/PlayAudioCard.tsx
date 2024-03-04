import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import { convertFromSecondsToClock } from "utils/math";
import BWIconButton from "./shared/BWIconButton";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";

interface PlayAudioCardProps {
  audio: AudioFile;
}

const PlayAudioCard: React.FC<PlayAudioCardProps> = ({ audio }) => {
  return (
    <BWView row justifyContent="space-between" alignItems="center" style={{ height: 80 }}>
      <BWView row gap={20}>
        <BWImage src={audio.poster} style={styles.audioImage} placeholder={!audio.poster} iconName="music" iconSize={40} />
        <BWView column style={{ height: "100%" }} justifyContent="space-evenly">
          <Text style={styles.audioTitle}>{audio.title}</Text>
          <BWView row>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.audioDescription}>
              {audio.about}
            </Text>
            <Text style={styles.audioDuration}> | {convertFromSecondsToClock(audio.duration)}</Text>
          </BWView>
        </BWView>
      </BWView>
      <BWIconButton onPress={() => {}} style={styles.playBtn} icon={() => <Ionicons name="md-play" size={16} color="black" />} />
    </BWView>
  );
};

export default memo(PlayAudioCard);

const styles = StyleSheet.create({
  audioImage: {
    height: 80,
    width: 80,
    borderRadius: 24,
  },

  audioTitle: {
    color: COLORS.MUTED[50],
    fontSize: 18,
    fontFamily: "MinomuBold",
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
