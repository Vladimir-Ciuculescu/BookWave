import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BWIconButton from "components/shared/BWIconButton";
import BWImage from "components/shared/BWImage";
import BWPressable from "components/shared/BWPressable";
import BWView from "components/shared/BWView";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { PlayList } from "types/interfaces/playlists";
import { COLORS } from "utils/colors";

interface PlayListCardProps {
  playlist: PlayList;
}

const PlayListCard: React.FC<PlayListCardProps> = ({ playlist }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  const goToPlaylistAudios = () => {
    navigation.navigate("PlaylistAudios", {
      id: playlist._id,
      title: playlist.title,
      poster: playlist.audios[0] ? playlist.audios[0].poster! : "",
      audiosCount: playlist.audios.length,
    });
  };

  return (
    <BWPressable onPress={goToPlaylistAudios}>
      <BWView row justifyContent="space-between" alignItems="center" style={{ height: 80 }}>
        <BWView row gap={20}>
          <BWImage
            //@ts-ignore
            src={playlist.audios[0] && playlist.audios[0].poster}
            placeholder={!playlist.audios[0]}
            style={styles.audioImage}
            iconName="music"
            iconSize={40}
          />
          <BWView column style={{ height: "100%" }} justifyContent="space-evenly">
            <Text style={styles.audioTitle}>{playlist.title}</Text>
            <BWView row>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.audioDescription}>
                {playlist.audios.length} songs
              </Text>
            </BWView>
          </BWView>
        </BWView>
        <BWIconButton link onPress={() => {}} icon={() => <Entypo name="dots-three-vertical" size={16} color={COLORS.MUTED[50]} />} />
      </BWView>
    </BWPressable>
  );
};

export default memo(PlayListCard);

const styles = StyleSheet.create({
  audioImage: {
    height: 80,
    width: 80,
    borderRadius: 16,
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

  playBtn: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: COLORS.WARNING[500],
  },
});
