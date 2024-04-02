import { AntDesign } from "@expo/vector-icons";
import PlayListService from "api/playlists.api";
import BWDivider from "components/shared/BWDivider";
import BWImage from "components/shared/BWImage";
import BWView from "components/shared/BWView";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { PlayList, PlayListAction } from "types/interfaces/playlists";
import { COLORS } from "utils/colors";

interface PlayListOptionsProps {
  playlist: PlayList | undefined;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const PlayListOptions: React.FC<PlayListOptionsProps> = ({ playlist, onClose, onRemove }) => {
  const dispatch = useDispatch();

  const options: PlayListAction[] = [
    {
      label: "Delete playlist",
      icon: <AntDesign name="delete" size={30} color={COLORS.MUTED[50]} />,
      onPress: async () => await deletePlaylist(),
    },
  ];

  const deletePlaylist = async () => {
    const data = await PlayListService.deletePlaylist({ playlistId: playlist!._id });
    onRemove(playlist!._id);
    onClose();
    dispatch(setToastMessageAction({ message: data.message, type: "success" }));
  };

  const isEmpty = playlist?.audios.length === 0;

  return (
    <BWView column gap={20}>
      <BWView row alignItems="center" gap={20}>
        <BWImage
          src={isEmpty ? "" : playlist?.audios[0].poster}
          placeholder={playlist!.audios.length === 0}
          iconName="image"
          style={styles.audioImage}
          iconSize={34}
        />
        <BWView column gap={10}>
          <Text style={styles.audioTitle}>{playlist!.title}</Text>
          <Text style={styles.audioTitle}>{playlist!.audios.length} songs</Text>
        </BWView>
      </BWView>
      <BWDivider orientation="horizontal" color={COLORS.DARK[300]} width="100%" thickness={2} />
      <BWView column gap={30}>
        {options.map((option: PlayListAction) => (
          <Pressable onPress={option.onPress} key={option.label} style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}>
            <BWView row alignItems="center" gap={20}>
              {option.icon}
              <Text style={styles.labelOption}>{option.label}</Text>
            </BWView>
          </Pressable>
        ))}
      </BWView>
    </BWView>
  );
};

export default PlayListOptions;

const styles = StyleSheet.create({
  audioImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  audioTitle: { fontSize: 16, fontFamily: "MinomuBold", color: COLORS.MUTED[50] },

  labelOption: {
    fontFamily: "Minomu",
    color: COLORS.MUTED[50],
    fontSize: 16,
  },
  pressed: {
    opacity: 0.5,
  },

  unpressed: {
    opacity: 1,
  },
});
