import React, { useState } from "react";
import { ScrollView, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { COLORS } from "utils/colors";
import BWView from "components/shared/BWView";
import BWButton from "components/shared/BWButton";
import AudioCard from "components/AudioCard";
import { Skeleton } from "moti/skeleton";
import BWBottomSheet from "components/shared/BWBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BWImage from "components/shared/BWImage";
import BWDivider from "components/shared/BWDivider";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { useDispatch } from "react-redux";
import PlayLists from "screens/Home/components/PlayLists";
import AddPlayList from "screens/Home/components/AddPlayList";
import { StatusBar } from "expo-status-bar";
import { AudioFile } from "types/interfaces/audios";
import { useFetchLatestAudios, useFetchRecommendedAudios } from "hooks/audios.queries";
import FavoriteService from "api/favorites.api";

interface Option {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}

const HomeScreen: React.FC<any> = () => {
  const [optionsBottomSheet, toggleOptionsBottomSheet] = useState<boolean>(false);
  const [playlistsBottomSheet, togglePlaylistsBottomSheet] = useState<boolean>(false);
  const [newPlayListBottomSheet, toggleNewPlayListBottomSheet] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | undefined>();
  const dispatch = useDispatch();

  const latestAudios = useFetchLatestAudios();
  const recommendedAudios = useFetchRecommendedAudios();

  const openOptionsBottomSheet = (audio: AudioFile) => {
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

  const toggleFavoriteAudio = async () => {
    try {
      const data = await FavoriteService.toggleFavoriteAudioApi(selectedAudio!.id);
      if (data.message) {
        dispatch(setToastMessageAction({ message: "Audio added to favorites !", type: "success" }));
      }
    } catch (error) {
      console.log(error);
      setToastMessageAction({ message: "Something went wrong, please try again !", type: "error" });
    }

    toggleOptionsBottomSheet(false);
  };

  const openPlaylistsBottomSheet = () => {
    toggleOptionsBottomSheet(false);
    togglePlaylistsBottomSheet(true);
  };

  const openNewPlayListBottomSheet = () => {
    togglePlaylistsBottomSheet(false);
    toggleNewPlayListBottomSheet(true);
  };

  const options: Option[] = [
    {
      label: "Play",
      icon: <FontAwesome name="play-circle" size={24} color={COLORS.MUTED[50]} />,
      onPress: () => {},
    },
    {
      label: "Add to playlist",
      icon: <MaterialCommunityIcons name="playlist-music" size={24} color={COLORS.MUTED[50]} />,
      onPress: () => openPlaylistsBottomSheet(),
    },
    {
      label: "Add to favorites",
      icon: <AntDesign name="hearto" size={24} color={COLORS.MUTED[50]} />,
      onPress: () => toggleFavoriteAudio(),
    },
  ];

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
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={styles.list}
            >
              {latestAudios.isLoading
                ? Array.of(5).map((_, index) => {
                    return <Skeleton colorMode="dark" width={150} key={index} />;
                  })
                : latestAudios.data.uploads.map((upload: AudioFile) => {
                    return (
                      <AudioCard
                        audio={upload}
                        key={upload.id}
                        onLongPress={() => openOptionsBottomSheet(upload)}
                      />
                    );
                  })}
            </ScrollView>
          </BWView>
          <BWView column gap={25}>
            <BWView row justifyContent="space-between">
              <Text style={styles.sectionTitle}>Recommended Uploads</Text>
              <BWButton onPress={() => {}} title="See all" link labelStyle={styles.sectionBtn} />
            </BWView>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={styles.list}
            >
              {recommendedAudios.isLoading
                ? Array.of(5).map((_, index) => {
                    return <Skeleton colorMode="dark" width={150} key={index} />;
                  })
                : recommendedAudios.data.audios.map((upload: AudioFile) => (
                    <AudioCard
                      audio={upload}
                      key={upload.id}
                      onLongPress={() => openOptionsBottomSheet(upload)}
                    />
                  ))}
            </ScrollView>
          </BWView>
        </BWView>
        <BWBottomSheet
          height="70%"
          blurBackground
          visible={optionsBottomSheet}
          onPressOut={closeOptionsBottomSheet}
        >
          <BWView column gap={20}>
            <BWView row alignItems="center" gap={20}>
              <BWImage
                src={selectedAudio?.poster!}
                placeholder={!selectedAudio?.poster}
                iconName="image"
                style={styles.audioImage}
                iconSize={34}
              />
              <Text style={styles.audioTitle}>{selectedAudio?.title}</Text>
            </BWView>
            <BWDivider
              orientation="horizontal"
              color={COLORS.DARK[300]}
              width="100%"
              thickness={1}
            />
            <BWView column gap={30}>
              {options.map((option: Option) => (
                <Pressable
                  onPress={option.onPress}
                  key={option.label}
                  style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}
                >
                  <BWView row alignItems="center" gap={20}>
                    {option.icon}
                    <Text style={styles.labelOption}>{option.label}</Text>
                  </BWView>
                </Pressable>
              ))}
            </BWView>
          </BWView>
        </BWBottomSheet>
        <BWBottomSheet
          height="80%"
          onPressOut={closePlayListsBottomSheet}
          blurBackground
          visible={playlistsBottomSheet}
        >
          <PlayLists
            audio={selectedAudio}
            onNewPlayList={openNewPlayListBottomSheet}
            onClose={closePlayListsBottomSheet}
          />
        </BWBottomSheet>
        <BWBottomSheet
          height="78%"
          visible={newPlayListBottomSheet}
          blurBackground
          onPressOut={closeNewPlayListBottomSheet}
          keyboardOffSet={1.5}
        >
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
});
