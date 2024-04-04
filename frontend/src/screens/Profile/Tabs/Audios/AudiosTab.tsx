import { useIsFocused } from "@react-navigation/native";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import PlayAudioCard from "components/PlayAudioCard";
import BWDivider from "components/shared/BWDivider";
import BWView from "components/shared/BWView";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { useFetchAudiosByProfile, useFetchAudiosTotalCountByProfile } from "hooks/audios.queries";
import useAudioController from "hooks/useAudioController";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useActiveTrack } from "react-native-track-player";
import { Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setQueueAction } from "redux/reducers/player.reducer";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../../../assets/illustrations";

const AudiosTab = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { isPlaying, onAudioPress } = useAudioController();
  const track = useActiveTrack();
  const { data: totalCount } = useFetchAudiosTotalCountByProfile({ isFocused });
  const { data: audios, isLoading } = useFetchAudiosByProfile({ isFocused });

  const setQueue = () => {
    dispatch(setQueueAction(audios));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BWView column gap={15}>
          {isLoading ? (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator color={COLORS.WARNING[500]} size="large" style={styles.loadingSpinner} />
            </View>
          ) : audios && audios.length ? (
            <>
              <Text style={styles.audioCounter}>{totalCount} item(s)</Text>
              <BWDivider orientation="horizontal" thickness={1.5} width="100%" color={COLORS.MUTED[700]} />
              <FlatList
                showsVerticalScrollIndicator={false}
                data={audios}
                contentContainerStyle={styles.listContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PlayAudioCard
                    onSelect={setQueue}
                    isPlaying={isPlaying && track! && track!.id === item.id}
                    audio={item}
                    onPress={() => onAudioPress(item, audios)}
                  />
                )}
              />
            </>
          ) : (
            <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
              <NoResultsFound width="100%" height={250} />
              <BWView column alignItems="center" gap={10}>
                <Text style={styles.notFoundTitle}>Not found</Text>
                <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
              </BWView>
            </BWView>
          )}
        </BWView>
        <AudioActionsBottomSheet optionsBottomSheetOffSet="70%" playlistsBottomSheetOffset="95%" newPlaylistBottomSheetOffset="90%" list={audios} />
      </View>
    </GestureHandlerRootView>
  );
};

export default AudiosTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  audioCounter: {
    color: COLORS.MUTED[50],
    fontFamily: "MinomuBold",
    fontSize: 22,
  },
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },

  loadingSpinner: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
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
