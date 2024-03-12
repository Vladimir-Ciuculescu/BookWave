import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import AudioPlayer from "components/AudioPlayer";
import PlayCardTest from "components/PlayCardTest";
import useAudioController from "hooks/useAudioController";
import { useLayoutEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useActiveTrack } from "react-native-track-player";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";

interface Latest_RecommendedScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
  route: RouteProp<StackNavigatorProps, "Latest_Recommended">;
}

const Latest_RecommendedScreen: React.FC<Latest_RecommendedScreenProps> = ({ navigation, route }) => {
  const {
    params: { listType },
  } = route;

  const { visibleModalPlayer, latest, recommended } = useSelector(playerSelector);
  const { isPlaying, onAudioPress } = useAudioController();
  const track = useActiveTrack();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: styles.header,
      headerShadowVisible: false,
      headerTitle: () => <Text style={{ fontFamily: "MinomuBold", color: COLORS.WARNING[500], fontSize: 20 }}>Latest uploads</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.WARNING[500]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const queue = listType === "recommended" ? recommended : latest;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={queue}
          initialNumToRender={20}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <PlayCardTest isPlaying={isPlaying && track! && track!.id === item.id} audio={item} onPress={() => onAudioPress(item, queue)} />
          )}
          contentContainerStyle={{ gap: 25 }}
        />

        <AudioActionsBottomSheet optionsBottomSheetOffSet="50%" playlistsBottomSheetOffset="60%" newPlaylistBottomSheetOffset="90%" list={queue} />
        {visibleModalPlayer && <AudioPlayer />}
      </View>
    </GestureHandlerRootView>
  );
};

export default Latest_RecommendedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 25,
  },

  header: {
    backgroundColor: COLORS.DARK[50],
    borderBottomWidth: 0,
  },
});
