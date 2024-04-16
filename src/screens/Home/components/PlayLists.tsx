import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import PlayListService from "api/playlists.api";
import { useFetchPlaylistsByProfile } from "hooks/playlists.queries";
import _ from "lodash";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { Checkbox, Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { Visibilites } from "types/enums/visibilites.enum";
import { AudioFile } from "types/interfaces/audios";
import { PlayList } from "types/interfaces/playlists";
import { COLORS } from "utils/colors";
import BWButton from "../../../components/shared/BWButton";
import BWDivider from "../../../components/shared/BWDivider";
import BWPressable from "../../../components/shared/BWPressable";
import BWView from "../../../components/shared/BWView";
import { NoResultsFound } from "../../../../assets/illustrations/index";
import AnimatedLottieView from "lottie-react-native";

const { width } = Dimensions.get("screen");

interface PlaylistStatus {
  playlistId: string;
  audioId: string;
  alreadyInPlaylist: boolean;
  title: string;
  visibility: Visibilites;
}

interface PlayListItemProps {
  playlist: PlayList;
  onToggle: (e: any) => void;
  audio: AudioFile;
  onGetPlayListStatus: (e: PlaylistStatus) => void;
}

const PlayListItem: React.FC<PlayListItemProps> = ({ playlist, onToggle, audio, onGetPlayListStatus }) => {
  const [alreadyInPlaylist, setAlreadyInPlaylist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkIfAlreadyInPlaylist = async () => {
      const payload = {
        audioId: audio.id,
        playlistId: playlist._id,
        title: playlist.title,
        visibility: playlist.visibility,
      };

      const alreadyInPlaylist = await PlayListService.getIsExistentInPlaylist(payload);

      onGetPlayListStatus({ ...payload, alreadyInPlaylist });

      setAlreadyInPlaylist(alreadyInPlaylist);
    };

    setLoading(true);

    checkIfAlreadyInPlaylist();

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [playlist]);

  const togglePlaylistStatus = () => {
    onToggle(playlist._id);
    setAlreadyInPlaylist((prevVlaue) => !prevVlaue);
  };

  return (
    <BWPressable onPress={togglePlaylistStatus}>
      <BWView row alignItems="center" justifyContent="space-between">
        <BWView row gap={20}>
          {loading ? (
            <Skeleton width={23} height={23} colors={[COLORS.MUTED[800], COLORS.MUTED[700], COLORS.MUTED[500]]} />
          ) : (
            <Checkbox value={alreadyInPlaylist} onValueChange={togglePlaylistStatus} color={COLORS.WARNING[500]} style={{ borderColor: COLORS.WARNING[500] }} />
          )}
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

  const [playlistsStatuses, setPlaylistStatuses] = useState<PlaylistStatus[]>([]);
  const [initalPlaylistStatuses, setInitialPlaylistStatuses] = useState<PlaylistStatus[]>([]);

  const dispatch = useDispatch();

  const getPlaylistStatus = (e: any) => {
    setPlaylistStatuses((prevValue) => [...prevValue, e]);
    setInitialPlaylistStatuses((prevValue) => [...prevValue, e]);
  };

  const toggleOnPlaylist = (playlistId: string) => {
    setPlaylistStatuses((prevPlaylists) => {
      const updatedPlaylists = prevPlaylists.map((playlist) => {
        if (playlist.playlistId === playlistId) {
          return { ...playlist, alreadyInPlaylist: !playlist.alreadyInPlaylist };
        }
        return playlist;
      });
      return updatedPlaylists;
    });
  };

  const handleAudioToPlaylists = async () => {
    if (_.isEqual(initalPlaylistStatuses, playlistsStatuses)) {
      onClose();
      return;
    }

    try {
      playlistsStatuses.map(async (playlist, index) => {
        // ? If status is the same as initial, do nothing

        if (playlist.alreadyInPlaylist === initalPlaylistStatuses[index].alreadyInPlaylist) {
          return;
        }

        // ? If audio is already in the playlist, remove it
        if (playlist.alreadyInPlaylist === false) {
          const payload = {
            playlistId: playlist.playlistId,
            audioId: playlist.audioId,
          };

          await PlayListService.removeFromPlaylist(payload);

          // ? Otherwise, add it to playlist
        } else {
          const payload = {
            title: playlist.title,
            id: playlist.playlistId,
            audioId: playlist.audioId,
            visibility: playlist.visibility,
          };

          await PlayListService.updatePlayListApi(payload);
        }
      });

      dispatch(setToastMessageAction({ message: "Playlists updated", type: "success" }));

      onClose();
    } catch (error) {
      dispatch(setToastMessageAction({ message: "An error occured, please try again !", type: "error" }));
    }
  };

  return (
    <BWView column gap={20} style={{ flex: 1 }}>
      <BWView row justifyContent="space-between">
        <Text style={styles.saveText}>Save audio to...</Text>
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
        {isLoading ? (
          <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <AnimatedLottieView style={{ height: width / 3 }} autoPlay loop source={require("../../../../assets/animations/loading.json")} />
          </View>
        ) : data && data.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            contentContainerStyle={{ gap: 30 }}
            keyExtractor={(item: PlayList) => item._id}
            renderItem={({ item }) => <PlayListItem onGetPlayListStatus={getPlaylistStatus} audio={audio!} onToggle={toggleOnPlaylist} playlist={item} />}
          />
        ) : (
          <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
            <NoResultsFound width="100%" height={250} />
            <BWView column alignItems="center" gap={10}>
              <Text style={styles.notFoundTitle}>Not found</Text>
              <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
            </BWView>
          </BWView>
        )}

        {}
      </BWView>
      <BWDivider width="100%" thickness={2} color={COLORS.DARK[300]} orientation="horizontal" />
      <BWButton
        onPress={handleAudioToPlaylists}
        style={styles.saveBtn}
        link
        labelStyle={styles.saveBtnLabel}
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

  saveText: {
    fontSize: 16,
    color: COLORS.MUTED[50],
    fontFamily: "Minomu",
  },

  saveBtn: {
    justifyContent: "flex-start",
    height: 40,
    paddingHorizontal: 20,
  },

  saveBtnLabel: {
    fontSize: 16,
    color: COLORS.MUTED[50],
    fontFamily: "Minomu",
  },
  notFoundTitle: {
    fontFamily: "MinomuBold",
    fontSize: 22,
    color: COLORS.MUTED[50],
  },

  notFoundDescription: {
    fontFamily: "Minomu",
    fontSize: 16,
    color: COLORS.MUTED[400],
    textAlign: "center",
  },
});
