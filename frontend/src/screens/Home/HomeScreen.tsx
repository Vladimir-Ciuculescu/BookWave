import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import AudioCard from "components/AudioCard";
import BWButton from "components/shared/BWButton";
import BWView from "components/shared/BWView";
import { StatusBar } from "expo-status-bar";
import { useFetchLatestAudios, useFetchRecommendedAudios } from "hooks/audios.queries";
import useAudioController from "hooks/useAudioController";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAudioAction, toggleOptionBottomSheetsAction } from "redux/reducers/audio-actions.reducer";
import { playerSelector, setLatestAudiosAction, setRecommendedAudiosAction } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import { NoData } from "../../../assets/illustrations";

const HomeScreen: React.FC<any> = () => {
  // ? Hooks
  const [audiosList, setAudiosList] = useState<AudioFile[]>([]);
  const { onAudioPress, isPlaying } = useAudioController();
  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  const { audio } = useSelector(playerSelector);
  const dispatch = useDispatch();
  const { data: latestAudios, isLoading: areLatestAudiosLoading } = useFetchLatestAudios();
  const { data: recommendedAudios, isLoading: areRecommendedAudiosLoading } = useFetchRecommendedAudios();

  // ?Functions
  const openOptionsBottomSheet = (audio: AudioFile, list: "recommended" | "latest") => {
    setAudiosList(list === "recommended" ? recommendedAudios.audios.slice(0, 5) : latestAudios.uploads.slice(0, 5));
    dispatch(toggleOptionBottomSheetsAction(true));
    dispatch(setSelectedAudioAction(audio));
  };

  const goToLatestAudios = async () => {
    navigation.navigate("Latest_Recommended", { listType: "latest" });
    dispatch(setLatestAudiosAction(latestAudios.uploads));
  };

  const goToRecommendedAudios = () => {
    navigation.navigate("Latest_Recommended", { listType: "recommended" });
    dispatch(setRecommendedAudiosAction(recommendedAudios.audios));
  };

  //? Mini components

  const renderLatestUploads = () => {
    if (areLatestAudiosLoading) {
      return Array.of(5).map((_, index) => <Skeleton colorMode="dark" width={140} height={140} key={index} />);
    } else {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[styles.list, !latestAudios.uploads.length ? { width: "100%" } : null]}
        >
          {!latestAudios.uploads.length ? (
            <BWView column alignItems="center" justifyContent="center" style={styles.noDataContainer} gap={25}>
              <NoData width="100%" height={200} />
              <Text style={styles.notFoundTitle}>No uploads found</Text>
            </BWView>
          ) : (
            latestAudios.uploads.map(
              (upload: AudioFile, index: number) =>
                index < 5 && (
                  <AudioCard
                    animation={isPlaying && audio && audio!.id === upload.id}
                    audio={upload}
                    key={upload.id}
                    onPress={() => onAudioPress(upload, latestAudios.uploads.slice(0, 5))}
                    onLongPress={() => openOptionsBottomSheet(upload, "latest")}
                  />
                ),
            )
          )}
        </ScrollView>
      );
    }
  };

  const renderRecommendedUploads = () => {
    if (areRecommendedAudiosLoading) {
      return Array.of(5).map((_, index) => <Skeleton colorMode="dark" width={140} height={140} key={index} />);
    } else {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[styles.list, !recommendedAudios.audios.length ? { width: "100%" } : null]}
        >
          {!recommendedAudios.audios.length ? (
            <BWView column alignItems="center" justifyContent="center" style={styles.noDataContainer} gap={25}>
              <NoData width="100%" height={200} />
              <Text style={styles.notFoundTitle}>No uploads found</Text>
            </BWView>
          ) : (
            recommendedAudios.audios.map(
              (upload: AudioFile, index: number) =>
                index < 5 && (
                  <AudioCard
                    animation={isPlaying && audio && audio.id === upload.id}
                    audio={upload}
                    key={upload.id}
                    onPress={() => onAudioPress(upload, recommendedAudios.audios.slice(0, 5))}
                    onLongPress={() => openOptionsBottomSheet(upload, "recommended")}
                  />
                ),
            )
          )}
        </ScrollView>
      );
    }
  };

  // ? File Component

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <BWView column gap={50} style={styles.screenContainer}>
          <BWView column gap={25}>
            <BWView row justifyContent="space-between">
              <Text style={styles.sectionTitle}>Latest Uploads</Text>
              <BWButton onPress={goToLatestAudios} title="See all" link labelStyle={styles.sectionBtn} />
            </BWView>

            {renderLatestUploads()}
          </BWView>
          <BWView column gap={25}>
            <BWView row justifyContent="space-between">
              <Text style={styles.sectionTitle}>Recommended Uploads</Text>
              <BWButton onPress={goToRecommendedAudios} title="See all" link labelStyle={styles.sectionBtn} />
            </BWView>
            {renderRecommendedUploads()}
          </BWView>
        </BWView>

        <AudioActionsBottomSheet optionsBottomSheetOffSet="60%" playlistsBottomSheetOffset="95%" newPlaylistBottomSheetOffset="78%" list={audiosList} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingTop: 20,
  },

  sectionTitle: {
    color: COLORS.MUTED[50],
    fontSize: 24,
    fontFamily: "MinomuBold",
    paddingHorizontal: 20,
  },
  sectionBtn: {
    color: COLORS.WARNING[500],
    fontSize: 16,
    fontFamily: "MinomuBold",
    paddingHorizontal: 20,
  },
  list: {
    gap: 15,
    paddingHorizontal: 20,
  },

  audioImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  audioTitle: { fontSize: 16, fontFamily: "MinomuBold", color: COLORS.MUTED[50] },
  pressed: {
    opacity: 0.5,
  },

  labelOption: { fontFamily: "Minomu", color: COLORS.MUTED[50], fontSize: 16 },

  unpressed: {
    opacity: 1,
  },

  noDataContainer: {
    display: "flex",
    width: "100%",
  },

  notFoundTitle: {
    fontFamily: "MinomuBold",
    fontSize: 22,
    color: COLORS.MUTED[50],
    textAlign: "center",
  },
});
