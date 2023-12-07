import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Text, Checkbox } from "react-native-ui-lib";
import BWView from "../../../components/shared/BWView";
import BWButton from "../../../components/shared/BWButton";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "utils/colors";
import BWDivider from "../../../components/shared/BWDivider";
import { PlayList } from "types/interfaces/playlists";
import { FontAwesome5 } from "@expo/vector-icons";
import { Visibilites } from "types/enums/visibilites.enum";
import BWPressable from "../../../components/shared/BWPressable";
import PlayListService from "api/playlists.api";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { AudioFile } from "types/interfaces/audios";
import { useFetchPlaylistsByProfile } from "hooks/playlists.queries";

interface PlayListItemProps {
  playlist: PlayList;
  onSelect: (e: PlayList) => void;
  selectedPlayList: PlayList | undefined;
  audio: AudioFile;
}

const PlayListItem: React.FC<PlayListItemProps> = ({
  playlist,
  onSelect,
  selectedPlayList,
  audio,
}) => {
  const isChecked = () => {
    if (!selectedPlayList) {
      return playlist.audios.includes(audio.id);
    } else {
      return selectedPlayList === playlist;
    }
  };

  const checked = isChecked();

  return (
    <BWPressable onPress={() => onSelect(playlist)}>
      <BWView row alignItems="center" justifyContent="space-between">
        <BWView row gap={20}>
          <Checkbox
            //value={selectedPlayList === playlist}
            // value={playlist.items.includes(audio.id) || selectedPlayList === playlist}
            value={checked}
            onValueChange={() => onSelect(playlist)}
            color={COLORS.WARNING[500]}
            style={{ borderColor: COLORS.WARNING[500] }}
          />
          <Text style={styles.playlistTitle}>{playlist.title}</Text>
        </BWView>

        {playlist.visibility === Visibilites.private ? (
          <FontAwesome5 name="lock" size={20} color={COLORS.MUTED[50]} />
        ) : (
          <FontAwesome5 name="globe-americas" size={20} color={COLORS.MUTED[50]} />
        )}
      </BWView>
    </BWPressable>
  );
};

interface PlayListsProps {
  onNewPlayList: () => void;
  audio: AudioFile | undefined;
  onClose: () => void;
}

const PlayLists: React.FC<PlayListsProps> = ({ onNewPlayList, audio, onClose }) => {
  const { data, isLoading } = useFetchPlaylistsByProfile();

  const [selectedPlayList, setSelectedPlayList] = useState<PlayList | undefined>();
  const dispath = useDispatch();

  const handlePlayList = (playlist: PlayList) => {
    setSelectedPlayList(playlist);
  };

  const handleSaveToPlaylist = async () => {
    if (selectedPlayList) {
      const payload = {
        title: selectedPlayList!.title,
        id: selectedPlayList!._id,
        audioId: audio!.id,
        visibility: selectedPlayList!.visibility,
      };

      try {
        await PlayListService.updatePlayListApi(payload);
        dispath(setToastMessageAction({ message: "Audio added to playlist !", type: "success" }));
        onClose();
      } catch (error) {
        dispath(
          setToastMessageAction({ message: "An error occured, please try again !", type: "error" }),
        );
      }
    } else {
      onClose();
    }
  };

  return (
    <BWView column gap={20} style={{ flex: 1 }}>
      <BWView row justifyContent="space-between">
        <Text style={{ fontSize: 16, color: COLORS.MUTED[50], fontFamily: "Minomu" }}>
          Save audio to...
        </Text>
        <BWButton
          onPress={onNewPlayList}
          link
          labelStyle={{ fontSize: 16, color: COLORS.MUTED[50], fontFamily: "Minomu" }}
          title="New playlist"
          iconSource={() => <AntDesign name="plus" size={24} color={COLORS.MUTED[50]} />}
        />
      </BWView>
      <BWDivider width="100%" thickness={2} color={COLORS.DARK[300]} orientation="horizontal" />
      <BWView style={{ height: "60%" }}>
        {data && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            contentContainerStyle={{ gap: 30 }}
            keyExtractor={(item: PlayList) => item._id}
            renderItem={({ item }) => (
              <PlayListItem
                audio={audio!}
                selectedPlayList={selectedPlayList}
                onSelect={handlePlayList}
                playlist={item}
              />
            )}
          />
        )}
      </BWView>
      <BWDivider width="100%" thickness={2} color={COLORS.DARK[300]} orientation="horizontal" />
      <BWButton
        onPress={handleSaveToPlaylist}
        style={{
          justifyContent: "flex-start",
          height: 40,
          paddingHorizontal: 20,
        }}
        link
        labelStyle={{
          fontSize: 16,
          color: COLORS.MUTED[50],
          fontFamily: "Minomu",
        }}
        title="Done"
        iconSource={() => <AntDesign name="check" size={24} color={COLORS.MUTED[50]} />}
      />
    </BWView>
  );
};

export default PlayLists;

const styles = StyleSheet.create({
  playlistTitle: {
    fontSize: 16,
    color: COLORS.MUTED[50],
    fontFamily: "Minomu",
  },
});
