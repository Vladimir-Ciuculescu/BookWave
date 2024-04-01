import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import PlayListService from "api/playlists.api";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import AudioPlayer from "components/AudioPlayer";
import PlayAudioCard from "components/PlayAudioCard";
import BWButton from "components/shared/BWButton";
import { useFetchPlaylistAudios } from "hooks/playlists.queries";
import useAudioController from "hooks/useAudioController";
import React, { forwardRef, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useActiveTrack } from "react-native-track-player";
import { Dash, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";
import { convertFromSecondsToClock } from "utils/math";

const { height, width } = Dimensions.get("window");

interface PlaylistAudiosScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
  route: RouteProp<StackNavigatorProps, "PlaylistAudios">;
}

const YourScreen: React.FC<PlaylistAudiosScreenProps> = ({ route, navigation }) => {
  const {
    params: { title, audiosCount, poster, id },
  } = route;

  //? Hooks
  const { data: audios, isLoading } = useFetchPlaylistAudios({ playlistId: id });
  const { visibleModalPlayer } = useSelector(playerSelector);
  const [totalDuration, setTotalDuration] = useState<number>();
  const scrollYOffset = useSharedValue(0);
  const { onAudioPress, isPlaying, replayList } = useAudioController();
  const track = useActiveTrack();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: styles.header,
      headerShadowVisible: false,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.WARNING[500]} />
        </TouchableOpacity>
      ),
    });

    const getTotal = async () => {
      const totalDuration = await PlayListService.getPlaylistAudiosTotalDurationApi({ playlistId: id });

      setTotalDuration(totalDuration);
    };

    getTotal();
  }, [navigation]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYOffset.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollYOffset.value, [0, 100], [height / 2.5, height / 4], Extrapolate.CLAMP),
  }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollYOffset.value, [0, 50], [1, 0], Extrapolate.CLAMP),
  }));

  const translateHeaderstyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollYOffset.value, [0, 100], [10, -90], Extrapolate.CLAMP),
      },
      {
        scale: interpolate(scrollYOffset.value, [0, 100], [1, 1.5], Extrapolate.CLAMP),
      },
    ],
  }));

  const playBtnStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollYOffset.value, [0, 100], [width / 2.5, width / 2.5 + 70], Extrapolate.CLAMP),
  }));

  const AnimatedBwButton = Animated.createAnimatedComponent(forwardRef(BWButton as any));

  const replay = async () => {
    await replayList(audios.audios);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <Animated.Image source={{ uri: poster }} style={[styles.image, animatedOpacityStyle]} />

            <Animated.View style={[{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }, translateHeaderstyle]}>
              <Text style={[{ fontFamily: "MinomuBold", color: COLORS.MUTED[50], fontSize: 32 }]}>{title}</Text>
              <View style={[{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }]}>
                <Text
                  style={{
                    fontFamily: "MinomuBold",
                    color: COLORS.MUTED[50],
                    fontSize: 20,
                  }}
                >
                  {audiosCount} songs
                </Text>
                <Dash vertical length={15} thickness={2.5} />
                <Text
                  style={{
                    fontFamily: "MinomuBold",
                    color: COLORS.MUTED[50],
                    fontSize: 20,
                  }}
                >
                  {convertFromSecondsToClock(totalDuration!)} mins
                </Text>
              </View>
              <AnimatedBwButton
                //@ts-ignore
                labelStyle={{ color: COLORS.MUTED[50], fontSize: 20, fontFamily: "MinomuBold" }}
                style={[{ borderRadius: 26, backgroundColor: COLORS.MUTED[600], height: 50 }, playBtnStyle]}
                onPress={replay}
                title="Play"
                iconSource={() => <AntDesign name="play" size={22} color={COLORS.WARNING[500]} />}
              />

              <Dash thickness={1} length={width - 40} />
            </Animated.View>
          </Animated.View>

          {isLoading ? (
            <View style={{ flex: 1 }}>
              <ActivityIndicator color={COLORS.WARNING[500]} size="large" style={styles.loadinngSpinner} />
            </View>
          ) : (
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
              data={audios.audios}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              keyExtractor={(item: AudioFile) => item.id}
              contentContainerStyle={styles.contentContainer}
              renderItem={({ item }) => (
                <PlayAudioCard isPlaying={isPlaying && track! && track!.id === item.id} audio={item} onPress={() => onAudioPress(item, audios.audios)} />
              )}
            />
          )}

          {visibleModalPlayer && <AudioPlayer />}
        </View>
        <AudioActionsBottomSheet
          optionsBottomSheetOffSet="50%"
          playlistsBottomSheetOffset="60%"
          newPlaylistBottomSheetOffset="90%"
          list={audios ? audios.audios : []}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadinngSpinner: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    paddingTop: height / 2.5 + 10,
  },

  header: {
    gap: 5,
    position: "absolute",
    backgroundColor: COLORS.DARK[50],
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width / 2.5,
    height: width / 2.5,
    borderRadius: 22,
  },
  scrollView: {
    flex: 1,
    paddingTop: height / 2.5 + 10,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 20,
    paddingBottom: 400,
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
});

export default YourScreen;
