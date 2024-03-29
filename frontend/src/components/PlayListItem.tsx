import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { PlayListElement } from "types/interfaces/playlists";
import { COLORS } from "utils/colors";
import BWImage from "./shared/BWImage";
import BWPressable from "./shared/BWPressable";

interface PlayListItemProps {
  playlist: PlayListElement;
}

const PlayListItem: React.FC<PlayListItemProps> = ({ playlist }) => {
  const { id, title, itemsCount } = playlist;

  return (
    <BWPressable style={styles.container} onPress={() => {}}>
      <BWImage style={styles.image} placeholder iconName="music" iconSize={40} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{itemsCount}</Text>
      </View>
    </BWPressable>
  );
};

export default PlayListItem;

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    borderRadius: 14,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  text: {
    fontFamily: "MinomuBold",
    fontSize: 22,
    color: COLORS.MUTED[50],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: COLORS.BACKDROP[50],
  },
});
