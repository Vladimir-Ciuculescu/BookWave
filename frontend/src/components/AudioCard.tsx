import { StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-ui-lib";
import BWView from "./shared/BWView";
import { COLORS } from "utils/colors";
import BWImage from "./shared/BWImage";
import { AudioFile } from "types/interfaces/audios";

interface AudioCard {
  audio: AudioFile;
  onPress?: () => void;
  onLongPress?: () => void;
}

const AudioCard: React.FC<AudioCard> = ({ audio, onPress, onLongPress }) => {
  return (
    <Pressable
      style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}
      delayLongPress={200}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <BWView column gap={10} key={audio.id} style={styles.listContainer}>
        <BWImage style={styles.image} placeholder={!audio.poster} src={audio.poster!} />
        <Text style={styles.imageTitle} numberOfLines={2} ellipsizeMode="tail">
          {audio.title}
        </Text>
      </BWView>
    </Pressable>
  );
};

export default AudioCard;

const styles = StyleSheet.create({
  listContainer: {
    width: 150,
  },

  pressed: {
    opacity: 0.7,
  },

  unpressed: {
    opacity: 1,
  },

  image: { height: 140, width: 140, borderRadius: 14 },
  placeholder: {
    height: 140,
    width: 140,
    borderRadius: 14,
    backgroundColor: COLORS.WARNING[400],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageTitle: {
    color: COLORS.MUTED[50],
    fontSize: 14,
    fontFamily: "MinomuBold",
  },
});
