import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import FavoriteService from "api/favorites.api";
import useAudioController from "hooks/useAudioController";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import {
  audioActionsSelector,
  toggleNewPlaylistBottomSheetAction,
  toggleOptionBottomSheetsAction,
  togglePlaylistsBottomSheetAction,
} from "redux/reducers/audio-actions.reducer";
import AddPlayList from "screens/Home/components/AddPlayList";
import PlayLists from "screens/Home/components/PlayLists";
import { AudioAction } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import BWBottomSheet from "./shared/BWBottomSheet";
import BWDivider from "./shared/BWDivider";
import BWImage from "./shared/BWImage";
import BWView from "./shared/BWView";

const AudioActionsBottomSheet: React.FC<any> = () => {
  const { isPlaying } = useAudioController();
  const dispatch = useDispatch();
  const { onAudioPress } = useAudioController();
  const { optionsVisible, playlistsVisible, newPlaylistVisible, selectedAudio } = useSelector(audioActionsSelector);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);

  useEffect(() => {
    if (optionsVisible) {
      const checkIfInFavorites = async () => {
        const isAudioInFavorites = await FavoriteService.getIsFavoriteApi(selectedAudio!.id);

        setIsInFavorites(isAudioInFavorites);
      };

      checkIfInFavorites();
    }
  }, [optionsVisible]);

  const options: AudioAction[] = [
    {
      label: isPlaying ? "Pause" : "Play",
      icon: <FontAwesome name={isPlaying ? "pause-circle" : "play-circle"} size={30} color={COLORS.MUTED[50]} />,
      // onPress: () => onAudioPress(selectedAudio!, audiosList),
      onPress: () => {},
    },
    {
      label: "Add to playlist",
      icon: <MaterialCommunityIcons name="playlist-music" size={24} color={COLORS.MUTED[50]} />,
      // onPress: () => addToPlaylistAction(),
      onPress: () => {},
    },
    {
      label: isInFavorites ? "Remove from favorites" : "Add to favorites",
      icon: <AntDesign name={isInFavorites ? "heart" : "hearto"} size={24} color={COLORS.MUTED[50]} />,
      // onPress: () => toggleFavoriteAudioAction(),
      onPress: () => {},
    },
  ];

  const closeOptionsBottomSheet = () => {
    dispatch(toggleOptionBottomSheetsAction(false));
  };

  const closePlayListsBottomSheet = () => {
    dispatch(togglePlaylistsBottomSheetAction(false));
  };

  const openNewPlayListBottomSheet = () => {
    dispatch(togglePlaylistsBottomSheetAction(false));
    dispatch(toggleNewPlaylistBottomSheetAction(true));
  };

  const closeNewPlayListBottomSheet = () => {
    dispatch(toggleNewPlaylistBottomSheetAction(false));
  };

  return (
    <>
      <BWBottomSheet height="70%" blurBackground visible={optionsVisible} onPressOut={closeOptionsBottomSheet}>
        <BWView column gap={20}>
          <BWView row alignItems="center" gap={20}>
            <BWImage src={selectedAudio?.poster!} placeholder={!selectedAudio?.poster} iconName="image" style={styles.audioImage} iconSize={34} />
            <Text style={styles.audioTitle}>{selectedAudio?.title}</Text>
          </BWView>
          <BWDivider orientation="horizontal" color={COLORS.DARK[300]} width="100%" thickness={2} />
          <BWView column gap={30}>
            {options.map((option: AudioAction) => (
              <Pressable onPress={option.onPress} key={option.label} style={({ pressed }) => (pressed ? styles.pressed : styles.unpressed)}>
                <BWView row alignItems="center" gap={20}>
                  {option.icon}
                  <Text style={styles.labelOption}>{option.label}</Text>
                </BWView>
              </Pressable>
            ))}
          </BWView>
        </BWView>
      </BWBottomSheet>
      <BWBottomSheet height="80%" visible={playlistsVisible} onPressOut={closePlayListsBottomSheet} blurBackground>
        <PlayLists audio={selectedAudio} onNewPlayList={openNewPlayListBottomSheet} onClose={closePlayListsBottomSheet} />
      </BWBottomSheet>
      <BWBottomSheet height="78%" visible={newPlaylistVisible} blurBackground onPressOut={closeNewPlayListBottomSheet} keyboardOffSet={1.5}>
        <AddPlayList audio={selectedAudio} onClose={closeNewPlayListBottomSheet} />
      </BWBottomSheet>
    </>
  );
};

export default AudioActionsBottomSheet;

const styles = StyleSheet.create({
  audioImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  audioTitle: { fontSize: 16, fontFamily: "MinomuBold", color: COLORS.MUTED[50] },
  labelOption: { fontFamily: "Minomu", color: COLORS.MUTED[50], fontSize: 16 },
  pressed: {
    opacity: 0.5,
  },

  unpressed: {
    opacity: 1,
  },
});
