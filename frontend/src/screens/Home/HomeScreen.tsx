import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import FavoriteService from "api/favorites.api";
import AudioCard from "components/AudioCard";
import BWBottomSheet from "components/shared/BWBottomSheet";
import BWButton from "components/shared/BWButton";
import BWDivider from "components/shared/BWDivider";
import BWImage from "components/shared/BWImage";
import BWView from "components/shared/BWView";
import { StatusBar } from "expo-status-bar";
import { useFetchLatestAudios, useFetchRecommendedAudios } from "hooks/audios.queries";
import useAudioController from "hooks/useAudioController";
import { Skeleton } from "moti/skeleton";
import React, { ReactNode, useEffect, useState } from "react";
import { Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import AddPlayList from "screens/Home/components/AddPlayList";
import PlayLists from "screens/Home/components/PlayLists";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import { NoData } from "../../../assets/illustrations";

interface Option {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}

const { width, height } = Dimensions.get("screen");

const HomeScreen: React.FC<any> = () => {
  const [optionsBottomSheet, toggleOptionsBottomSheet] = useState<boolean>(false);
  const [playlistsBottomSheet, togglePlaylistsBottomSheet] = useState<boolean>(false);
  const [newPlayListBottomSheet, toggleNewPlayListBottomSheet] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | undefined>();
  const [audiosList, setAudiosList] = useState<AudioFile[]>([]);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const { onAudioPress, isPlaying } = useAudioController();

  const { audio } = useSelector(playerSelector);

  const dispatch = useDispatch();

  const latestAudios = useFetchLatestAudios();
  const recommendedAudios = useFetchRecommendedAudios();

  useEffect(() => {
    if (optionsBottomSheet) {
      const checkIfInFavorites = async () => {
        const isAudioInFavorites = await FavoriteService.getIsFavoriteApi(selectedAudio!.id);

        setIsInFavorites(isAudioInFavorites);
      };

      checkIfInFavorites();
    }
  }, [selectedAudio]);

  const openOptionsBottomSheet = (audio: AudioFile, list: "recommended" | "latest") => {
    setAudiosList(list === "recommended" ? recommendedAudios.data.audios : latestAudios.data.uploads);

    toggleOptionsBottomSheet(true);
    setSelectedAudio(audio);
  };

  const closeOptionsBottomSheet = () => {
    toggleOptionsBottomSheet(false);
    setSelectedAudio(undefined);
  };

  const closePlayListsBottomSheet = () => {
    togglePlaylistsBottomSheet(false);
    setSelectedAudio(undefined);
  };

  const closeNewPlayListBottomSheet = () => {
    toggleNewPlayListBottomSheet(false);
    setSelectedAudio(undefined);
  };

  const toggleFavoriteAudioAction = async () => {
    try {
      setIsInFavorites((prevValue) => !prevValue);

      const data = await FavoriteService.toggleFavoriteAudioApi(selectedAudio!.id);

      if (data.message) {
        dispatch(setToastMessageAction({ message: isInFavorites ? "Audio removed from favorites !" : "Audio added to favorites !", type: "success" }));
      }
    } catch (error) {
      console.log(error);
      dispatch(setToastMessageAction({ message: "Something went wrong, please try again !", type: "error" }));
    }
  };

  const addToPlaylistAction = () => {
    toggleOptionsBottomSheet(false);
    togglePlaylistsBottomSheet(true);
  };

  const openNewPlayListBottomSheet = () => {
    togglePlaylistsBottomSheet(false);
    toggleNewPlayListBottomSheet(true);
  };

  const options: Option[] = [
    {
      label: isPlaying ? "Pause" : "Play",
      icon: <FontAwesome name={isPlaying ? "pause-circle" : "play-circle"} size={30} color={COLORS.MUTED[50]} />,
      onPress: () => onAudioPress(selectedAudio!, audiosList),
    },
    {
      label: "Add to playlist",
      icon: <MaterialCommunityIcons name="playlist-music" size={24} color={COLORS.MUTED[50]} />,
      onPress: () => addToPlaylistAction(),
    },
    {
      label: isInFavorites ? "Remove from favorites" : "Add to favorites",
      icon: <AntDesign name={isInFavorites ? "heart" : "hearto"} size={24} color={COLORS.MUTED[50]} />,
      onPress: () => toggleFavoriteAudioAction(),
    },
  ];

  const renderLatestUploads = () => {
    if (latestAudios.isLoading) {
      return Array.of(5).map((_, index) => <Skeleton colorMode="dark" width={140} height={140} key={index} />);
    } else {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[styles.list, !latestAudios.data.uploads.length ? { width: "100%" } : null]}
        >
          {!latestAudios.data.uploads.length ? (
            <BWView column alignItems="center" justifyContent="center" style={styles.noDataContainer} gap={25}>
              <NoData width="100%" height={200} />
              <Text style={styles.notFoundTitle}>No uploads found</Text>
            </BWView>
          ) : (
            latestAudios.data.uploads.map((upload: AudioFile) => {
              return (
                <AudioCard
                  animation={isPlaying && audio && audio!.id === upload.id}
                  audio={upload}
                  key={upload.id}
                  onPress={() => onAudioPress(upload, latestAudios.data.uploads)}
                  onLongPress={() => openOptionsBottomSheet(upload, "latest")}
                />
              );
            })
          )}
        </ScrollView>
      );
    }
  };

  const renderRecommendedUploads = () => {
    if (recommendedAudios.isLoading) {
      return Array.of(5).map((_, index) => <Skeleton colorMode="dark" width={140} height={140} key={index} />);
    } else {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[styles.list, !recommendedAudios.data.audios.length ? { width: "100%" } : null]}
        >
          {!recommendedAudios.data.audios.length ? (
            <BWView column alignItems="center" justifyContent="center" style={styles.noDataContainer} gap={25}>
              <NoData width="100%" height={200} />
              <Text style={styles.notFoundTitle}>No uploads found</Text>
            </BWView>
          ) : (
            recommendedAudios.data.audios.map((upload: AudioFile) => {
              return (
                <AudioCard
                  animation={isPlaying && audio && audio.id === upload.id}
                  audio={upload}
                  key={upload.id}
                  onPress={() => onAudioPress(upload, recommendedAudios.data.audios)}
                  onLongPress={() => openOptionsBottomSheet(upload, "recommended")}
                />
              );
            })
          )}
        </ScrollView>
      );
    }
  };

  const renderAudioActions = () => (
    <BWView column gap={20}>
      <BWView row alignItems="center" gap={20}>
        <BWImage src={selectedAudio?.poster!} placeholder={!selectedAudio?.poster} iconName="image" style={styles.audioImage} iconSize={34} />
        <Text style={styles.audioTitle}>{selectedAudio?.title}</Text>
      </BWView>
      <BWDivider orientation="horizontal" color={COLORS.DARK[300]} width="100%" thickness={2} />
      <BWView column gap={30}>
        {options.map((option: Option) => (
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <BWView column gap={50} style={styles.screenContainer}>
          <BWView column gap={25}>
            <BWView row justifyContent="space-between">
              <Text style={styles.sectionTitle}>Latest Uploads</Text>
              <BWButton onPress={() => {}} title="See all" link labelStyle={styles.sectionBtn} />
            </BWView>

            {renderLatestUploads()}
          </BWView>
          <BWView column gap={25}>
            <BWView row justifyContent="space-between">
              <Text style={styles.sectionTitle}>Recommended Uploads</Text>
              <BWButton onPress={() => {}} title="See all" link labelStyle={styles.sectionBtn} />
            </BWView>
            {renderRecommendedUploads()}
          </BWView>
        </BWView>
        <BWBottomSheet height="70%" blurBackground visible={optionsBottomSheet} onPressOut={closeOptionsBottomSheet}>
          {renderAudioActions() as ReactNode}
        </BWBottomSheet>
        <BWBottomSheet height="80%" onPressOut={closePlayListsBottomSheet} blurBackground visible={playlistsBottomSheet}>
          <PlayLists audio={selectedAudio} onNewPlayList={openNewPlayListBottomSheet} onClose={closePlayListsBottomSheet} />
        </BWBottomSheet>
        <BWBottomSheet height="78%" visible={newPlayListBottomSheet} blurBackground onPressOut={closeNewPlayListBottomSheet} keyboardOffSet={1.5}>
          <AddPlayList audio={selectedAudio} onClose={closeNewPlayListBottomSheet} />
        </BWBottomSheet>
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
    //width: "100%",
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
