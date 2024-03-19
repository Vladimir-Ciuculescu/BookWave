import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import FavoriteService from "api/favorites.api";
import useAudioController from "hooks/useAudioController";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import TrackPlayer, { Event, useActiveTrack, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { Dialog, PanningProvider, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { audioActionsSelector, setSelectedAudioAction } from "redux/reducers/audio-actions.reducer";
import { playerSelector, setAudioAction, setVisibileModalPlayerAction } from "redux/reducers/player.reducer";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";
import { convertFromSecondsToClock } from "utils/math";
import BWDivider from "./shared/BWDivider";
import BWIconButton from "./shared/BWIconButton";
import BWImage from "./shared/BWImage";
import BWPressable from "./shared/BWPressable";
import BWView from "./shared/BWView";

const { height, width } = Dimensions.get("screen");

const speedRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const AudioPlayer: React.FC<any> = () => {
  // ? Hooks
  const [playbackModal, togglePlaybackModal] = useState<boolean>(false);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const [currentRate, setCurrentRate] = useState<number>(1);
  const { audio, list, visibleModalPlayer } = useSelector(playerSelector);
  const { selectedAudio } = useSelector(audioActionsSelector);
  const { position, duration } = useProgress(300);
  const { isPlaying, onAudioPress, skipTo } = useAudioController();
  const track = useActiveTrack();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIfInFavorites = async () => {
      const isAudioInFavorites = await FavoriteService.getIsFavoriteApi(selectedAudio!.id);

      setIsInFavorites(isAudioInFavorites);
    };
    if (visibleModalPlayer) {
      checkIfInFavorites();
    }
  }, [visibleModalPlayer]);

  useEffect(() => {
    const getRate = async () => {
      const rate = await TrackPlayer.getRate();
      setCurrentRate(rate);
    };

    if (playbackModal) {
      getRate();
    }
  }, [playbackModal]);

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], (event) => {
    if (event && event.track) {
      const payload: AudioFile = {
        id: event.track.id,
        title: event!.track!.title!,
        about: event.track.about,
        //@ts-ignore
        category: event!.track!.genre!,
        file: event.track.url,
        poster: event.track.artwork,
        owner: event.track.owner,
        duration: event!.track!.duration!,
      };
      dispatch(setSelectedAudioAction(payload));
    }
  });

  // ? Functions

  const stepTimestamp = async (direction: "backward" | "forward") => {
    await skipTo(direction === "backward" ? -10 : 10);
  };

  const seekTimeStamp = async (second: number) => {
    await TrackPlayer.seekTo(second);
  };

  const stepBackWard = async () => {
    const currentList = await TrackPlayer.getQueue();

    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex === null) {
      return;
    }

    const previousTrack = currentList[currentIndex! - 1];

    if (previousTrack) {
      await TrackPlayer.skipToPrevious();
      dispatch(setAudioAction(list[currentIndex! - 1]));
    }
  };

  const stepForward = async () => {
    const currentList = await TrackPlayer.getQueue();

    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex === null) {
      return;
    }

    const nextTrack = currentList[currentIndex! + 1];

    if (nextTrack) {
      await TrackPlayer.skipToNext();
      dispatch(setAudioAction(list[currentIndex! + 1]));
    }
  };

  const findTrackIndex = (data: any[], track: any) => {
    const trackIndex = data.findIndex((audio) => audio.id === track.id);
    return trackIndex;
  };

  const closePlayer = () => {
    dispatch(setVisibileModalPlayerAction(false));
  };

  const renderSpeedRate = (rate: number) => {
    if (rate === 1) {
      return "Normal";
    }

    return `${rate}x`;
  };

  const changeSpeedRate = async (rate: number) => {
    try {
      await TrackPlayer.setRate(rate);
      setCurrentRate(rate);
    } catch (error: any) {
      dispatch(setToastMessageAction({ message: error.message, type: "error" }));
    }
  };

  const toggleFavoriteAudio = async () => {
    try {
      await FavoriteService.toggleFavoriteAudioApi(audio!.id);

      setIsInFavorites((prevValue) => !prevValue);

      dispatch(setToastMessageAction({ message: isInFavorites ? "Audio removed from favorites" : "Audio added to favorites", type: "success" }));
    } catch (error) {
      console.log(error);
      dispatch(setToastMessageAction({ message: "An unexpected error occured !", type: "error" }));
    }
  };

  const isCurrentTrack = track && selectedAudio && track.id === selectedAudio.id;

  const isLastTrack = track ? findTrackIndex(list, audio) === list.length - 1 : false;

  const isFirstTrack = track ? findTrackIndex(list, audio) === 0 : false;

  const isCurrentRate = (rate: number) => currentRate === rate;

  return (
    <Dialog
      bottom={true}
      height={(height * 80) / 100}
      onDismiss={closePlayer}
      panDirection={PanningProvider.Directions.DOWN}
      visible={visibleModalPlayer}
      containerStyle={styles.dialogContainer}
    >
      <View style={styles.dialogContent}>
        <BWView column alignItems="center" gap={16} style={{ paddingHorizontal: 20 }}>
          <BWImage src={selectedAudio?.poster} style={styles.image} placeholder={!selectedAudio?.poster} iconName="image" />
          <BWView column alignItems="center" gap={8}>
            <Text style={styles.title}>{isCurrentTrack ? track.title : selectedAudio?.title}</Text>
            <Text style={styles.about}>{isCurrentTrack ? track.about : selectedAudio?.about}</Text>
          </BWView>
          <BWDivider orientation="horizontal" thickness={1.2} width="100%" color={COLORS.MUTED[700]} />

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={isCurrentTrack ? duration : selectedAudio?.duration}
            value={isCurrentTrack ? position : 0}
            onSlidingComplete={seekTimeStamp}
            minimumTrackTintColor={COLORS.WARNING[500]}
            maximumTrackTintColor={COLORS.WARNING[500]}
            thumbTintColor={COLORS.WARNING[600]}
          />
          <BWView style={{ width: "100%" }} row justifyContent="space-between">
            <Text style={styles.position}>{isCurrentTrack ? convertFromSecondsToClock(position) : "00:00"} </Text>

            <Text style={styles.position}>{isCurrentTrack ? convertFromSecondsToClock(duration) : convertFromSecondsToClock(selectedAudio!.duration)} </Text>
          </BWView>
          <BWView row style={{ width: "100%" }} justifyContent="space-between" alignItems="center">
            <BWIconButton
              link
              icon={() => <AntDesign name="stepbackward" size={30} color={COLORS.MUTED[50]} />}
              onPress={stepBackWard}
              disabled={isFirstTrack}
            />
            <BWIconButton link icon={() => <MaterialIcons name="replay-10" size={40} color={COLORS.MUTED[50]} />} onPress={() => stepTimestamp("backward")} />
            <BWIconButton
              style={styles.toggleButton}
              icon={() =>
                isCurrentTrack && isPlaying ? (
                  <Ionicons name="pause" size={22} color={COLORS.MUTED[50]} />
                ) : (
                  <FontAwesome5 name="play" size={22} color={COLORS.MUTED[50]} />
                )
              }
              onPress={() => onAudioPress(selectedAudio!, list)}
            />
            <BWIconButton link icon={() => <MaterialIcons name="forward-10" size={40} color={COLORS.MUTED[50]} />} onPress={() => stepTimestamp("forward")} />

            <BWIconButton link icon={() => <AntDesign name="stepforward" size={30} color={COLORS.MUTED[50]} />} onPress={stepForward} disabled={isLastTrack} />
          </BWView>
          <BWView row gap={50} style={{ marginTop: 30 }}>
            <BWIconButton
              link
              icon={() => <AntDesign name={isInFavorites ? "heart" : "hearto"} size={30} color={COLORS.MUTED[50]} />}
              onPress={toggleFavoriteAudio}
            />
            <BWIconButton link icon={() => <MaterialIcons name="speed" size={30} color={COLORS.MUTED[50]} />} onPress={() => togglePlaybackModal(true)} />
          </BWView>
        </BWView>
        <Dialog
          visible={playbackModal}
          bottom={true}
          panDirection={PanningProvider.Directions.DOWN}
          containerStyle={{ backgroundColor: COLORS.MUTED[900], borderRadius: 10, width: "100%", alignSelf: "center" }}
          useSafeArea
          onDismiss={() => togglePlaybackModal(false)}
        >
          <BWView column>
            {speedRates.map((speedRate, index) => {
              return (
                <BWPressable key={index} onPress={() => changeSpeedRate(speedRate)} style={{ paddingHorizontal: 50, paddingVertical: 13 }}>
                  <Text style={{ fontFamily: "MinomuBold", fontSize: 20, color: COLORS.MUTED[50] }}>{renderSpeedRate(speedRate)}</Text>
                  {isCurrentRate(speedRate) && <Feather name="check" size={24} color="white" style={{ position: "absolute", left: 10, top: 15 }} />}
                </BWPressable>
              );
            })}
          </BWView>
        </Dialog>
      </View>
    </Dialog>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  dialogContainer: {
    width: width,
    alignSelf: "center",
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
  dialogContent: {
    backgroundColor: COLORS.MUTED[800],
    height: "100%",
    paddingTop: 40,
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 20,
  },

  title: {
    color: COLORS.MUTED[50],
    fontSize: 24,
    fontFamily: "MinomuBold",
  },
  about: {
    color: COLORS.MUTED[300],
    fontSize: 24,
    fontFamily: "Minomu",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  position: {
    color: COLORS.MUTED[50],
    fontFamily: "MinomuBold",
  },

  toggleButton: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.WARNING[500],
    paddingLeft: 4,
  },
});
