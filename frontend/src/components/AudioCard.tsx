import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-ui-lib";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import SoundWave from "./SoundWave";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";

interface AudioCard {
  audio: AudioFile;
  onPress?: () => void;
  onLongPress?: () => void;
  animation?: boolean;
}

const AudioCard: React.FC<AudioCard> = ({ audio, onPress, onLongPress, animation }) => {
  return (
    <Pressable style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)} delayLongPress={200} onPress={onPress} onLongPress={onLongPress}>
      <BWView column gap={10} key={audio.id} style={styles.listContainer}>
        <View style={styles.imageContainer}>
          {animation && <SoundWave />}
          <BWImage style={styles.image} placeholder={!audio.poster} iconName="image" src={audio.poster!} />
        </View>

        <Text style={styles.imageTitle} numberOfLines={1} ellipsizeMode="tail">
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

  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 14,
  },

  image: { width: "100%", height: "100%", borderRadius: 14 },
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
