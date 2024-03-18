import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import AudioPlayer from "components/AudioPlayer";
import PlayCardTest from "components/PlayCardTest";
import BWButton from "components/shared/BWButton";
import { useFetchFavorites } from "hooks/favorites.queries";
import React, { forwardRef, useLayoutEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Dash, Text } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import { AudioFile } from "types/interfaces/audios";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";

const { height, width } = Dimensions.get("window");

// const HEADER_MAX_HEIGHT = 200;
// const HEADER_MIN_HEIGHT = 100;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface PlaylistAudiosScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
  route: RouteProp<StackNavigatorProps, "PlaylistAudios">;
}

const YourScreen: React.FC<PlaylistAudiosScreenProps> = ({ route, navigation }) => {
  const {
    params: { title, audiosCount, poster, id },
  } = route;

  const { visibleModalPlayer } = useSelector(playerSelector);

  // const scrollYOffset = useSharedValue(height / 2.5);
  const scrollYOffset = useSharedValue(0);

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
  }, [navigation]);

  // TODO Fetch current playlists of the song and paginate it
  const { data, refetch, isLoading, isFetching } = useFetchFavorites({ pageNumber: "0" });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // translationY.value = event.contentOffset.y;
      scrollYOffset.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollYOffset.value,
      [0, 100], // adjust the range according to your requirement
      [height / 2.5, height / 4], // adjust the header height accordingly
      Extrapolate.CLAMP,
    ),
  }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollYOffset.value,
      [0, 50], // adjust the range according to your requirement
      [1, 0], // adjust the header height accordingly
      Extrapolate.CLAMP,
    ),
  }));

  const translateHeaderstyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollYOffset.value,
          [0, 100], // adjust the range according to your requirement
          [10, -90], // adjust the header height accordingly
          Extrapolate.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollYOffset.value,
          [0, 100], // adjust the range according to your requirement
          [1, 1.5], // adjust the header height accordingly
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const playBtnStyle = useAnimatedStyle(() => ({
    width: interpolate(
      scrollYOffset.value,
      [0, 100], // adjust the range according to your requirement
      [width / 2.5, width / 2.5 + 70], // adjust the header height accordingly
      Extrapolate.CLAMP,
    ),
  }));

  const AnimatedBwButton = Animated.createAnimatedComponent(forwardRef(BWButton as any));

  return (
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
              56 songs
            </Text>
            <Dash vertical length={15} thickness={2.5} />
            <Text
              style={{
                fontFamily: "MinomuBold",
                color: COLORS.MUTED[50],
                fontSize: 20,
              }}
            >
              01:25:43 mins
            </Text>
          </View>
          <AnimatedBwButton
            //@ts-ignore
            labelStyle={{ color: COLORS.MUTED[50], fontSize: 20, fontFamily: "MinomuBold" }}
            style={[{ borderRadius: 26, backgroundColor: COLORS.MUTED[600], height: 50 }, playBtnStyle]}
            onPress={() => {}}
            title="Play"
            iconSource={() => <AntDesign name="play" size={22} color={COLORS.WARNING[500]} />}
          />

          <Dash thickness={1} length={width - 40} />
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        data={data}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        keyExtractor={(item: AudioFile) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => <PlayCardTest isPlaying={false} audio={item} onPress={() => {}} />}
      />
      {visibleModalPlayer && <AudioPlayer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 5,
    position: "absolute",
    //backgroundColor: "red",
    backgroundColor: COLORS.DARK[50],
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 9999,
    //height: 300,
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
    //paddingTop: HEADER_MAX_HEIGHT,
    paddingTop: height / 2.5 + 10,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 20,
    paddingBottom: 400, // Add some padding to see the content at the bottom
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
});

export default YourScreen;
