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
import { playerSelector } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import { NoData } from "../../../assets/illustrations";

const HomeScreen: React.FC<any> = () => {
  const [optionsBottomSheet, toggleOptionsBottomSheet] = useState<boolean>(false);
  // const [playlistsBottomSheet, togglePlaylistsBottomSheet] = useState<boolean>(false);
  // const [newPlayListBottomSheet, toggleNewPlayListBottomSheet] = useState<boolean>(false);
  // const [selectedAudio, setSelectedAudio] = useState<AudioFile | undefined>();
  const [audiosList, setAudiosList] = useState<AudioFile[]>([]);
  // const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const { onAudioPress, isPlaying } = useAudioController();
  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  const { audio } = useSelector(playerSelector);

  const dispatch = useDispatch();

  const { data: latestAudios, isLoading: areLatestAudiosLoading } = useFetchLatestAudios();
  const { data: recommendedAudios, isLoading: areRecommendedAudiosLoading } = useFetchRecommendedAudios();

  // useEffect(() => {
  //   if (optionsBottomSheet) {
  //     const checkIfInFavorites = async () => {
  //       const isAudioInFavorites = await FavoriteService.getIsFavoriteApi(selectedAudio!.id);

  //       setIsInFavorites(isAudioInFavorites);
  //     };

  //     checkIfInFavorites();
  //   }
  // }, [selectedAudio]);

  const openOptionsBottomSheet = (audio: AudioFile, list: "recommended" | "latest") => {
    // await updateQueueList(list === "recommended" ? recommendedAudios.audios.slice(0, 5) : latestAudios.uploads.slice(0, 5));

    setAudiosList(list === "recommended" ? recommendedAudios.audios.slice(0, 5) : latestAudios.uploads.slice(0, 5));
    dispatch(toggleOptionBottomSheetsAction(true));
    dispatch(setSelectedAudioAction(audio));
    // toggleOptionsBottomSheet(true);
    //setSelectedAudio(audio);
  };

  // const closeOptionsBottomSheet = () => {
  //   toggleOptionsBottomSheet(false);
  //   setSelectedAudio(undefined);
  // };

  // const closePlayListsBottomSheet = () => {
  //   togglePlaylistsBottomSheet(false);
  //   setSelectedAudio(undefined);
  // };

  // const closeNewPlayListBottomSheet = () => {
  //   toggleNewPlayListBottomSheet(false);
  //   setSelectedAudio(undefined);
  // };

  // const toggleFavoriteAudioAction = async () => {
  //   try {
  //     setIsInFavorites((prevValue) => !prevValue);

  //     const data = await FavoriteService.toggleFavoriteAudioApi(selectedAudio!.id);

  //     if (data.message) {
  //       dispatch(setToastMessageAction({ message: isInFavorites ? "Audio removed from favorites !" : "Audio added to favorites !", type: "success" }));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     dispatch(setToastMessageAction({ message: "Something went wrong, please try again !", type: "error" }));
  //   }
  // };

  // const addToPlaylistAction = () => {
  //   toggleOptionsBottomSheet(false);
  //   togglePlaylistsBottomSheet(true);
  // };

  // const openNewPlayListBottomSheet = () => {
  //   togglePlaylistsBottomSheet(false);
  //   toggleNewPlayListBottomSheet(true);
  // };

  const goToLatestAudios = () => {
    navigation.navigate("Latest_Recommended", { uploads: latestAudios.uploads });
  };

  const goToRecommendedAudios = () => {
    navigation.navigate("Latest_Recommended", { uploads: recommendedAudios.uploads });
  };

  // const options: AudioAction[] = [
  //   {
  //     label: isPlaying ? "Pause" : "Play",
  //     icon: <FontAwesome name={isPlaying ? "pause-circle" : "play-circle"} size={30} color={COLORS.MUTED[50]} />,
  //     onPress: () => onAudioPress(selectedAudio!, audiosList),
  //   },
  //   {
  //     label: "Add to playlist",
  //     icon: <MaterialCommunityIcons name="playlist-music" size={24} color={COLORS.MUTED[50]} />,
  //     onPress: () => addToPlaylistAction(),
  //   },
  //   {
  //     label: isInFavorites ? "Remove from favorites" : "Add to favorites",
  //     icon: <AntDesign name={isInFavorites ? "heart" : "hearto"} size={24} color={COLORS.MUTED[50]} />,
  //     onPress: () => toggleFavoriteAudioAction(),
  //   },
  // ];

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
                    // onLongPress={() => openOptionsBottomSheet(upload, "latest")}
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

  // const renderAudioActions = () => (
  //   <BWView column gap={20}>
  //     <BWView row alignItems="center" gap={20}>
  //       <BWImage src={selectedAudio?.poster!} placeholder={!selectedAudio?.poster} iconName="image" style={styles.audioImage} iconSize={34} />
  //       <Text style={styles.audioTitle}>{selectedAudio?.title}</Text>
  //     </BWView>
  //     <BWDivider orientation="horizontal" color={COLORS.DARK[300]} width="100%" thickness={2} />
  //     <BWView column gap={30}>
  //       {options.map((option: AudioAction) => (
  //         <Pressable onPress={option.onPress} key={option.label} style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}>
  //           <BWView row alignItems="center" gap={20}>
  //             {option.icon}
  //             <Text style={styles.labelOption}>{option.label}</Text>
  //           </BWView>
  //         </Pressable>
  //       ))}
  //     </BWView>
  //   </BWView>
  // );

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
        {/* <BWBottomSheet height="70%" blurBackground visible={optionsBottomSheet} onPressOut={closeOptionsBottomSheet}>
          {renderAudioActions() as ReactNode}
        </BWBottomSheet>
        <BWBottomSheet height="80%" onPressOut={closePlayListsBottomSheet} blurBackground visible={playlistsBottomSheet}>
          <PlayLists audio={selectedAudio} onNewPlayList={openNewPlayListBottomSheet} onClose={closePlayListsBottomSheet} />
        </BWBottomSheet>
        <BWBottomSheet height="78%" visible={newPlayListBottomSheet} blurBackground onPressOut={closeNewPlayListBottomSheet} keyboardOffSet={1.5}>
          <AddPlayList audio={selectedAudio} onClose={closeNewPlayListBottomSheet} />
        </BWBottomSheet> */}
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
