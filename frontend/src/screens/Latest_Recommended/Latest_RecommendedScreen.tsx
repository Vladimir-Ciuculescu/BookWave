import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import PlayAudioCard from "components/PlayAudioCard";
import { useLayoutEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setSelectedAudioAction, toggleOptionBottomSheetsAction } from "redux/reducers/audio-actions.reducer";
import { AudioFile } from "types/interfaces/audios";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { COLORS } from "utils/colors";

interface Latest_RecommendedScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
  route: RouteProp<StackNavigatorProps, "Latest_Recommended">;
}

const Latest_RecommendedScreen: React.FC<Latest_RecommendedScreenProps> = ({ navigation, route }) => {
  const {
    params: { uploads },
  } = route;

  const dispatch = useDispatch();

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

  const selectAudio = (audio: AudioFile) => {
    dispatch(setSelectedAudioAction(audio));
    dispatch(toggleOptionBottomSheetsAction(true));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={uploads}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <PlayAudioCard onSelect={() => selectAudio(item)} audio={item} onPlay={() => {}} />}
          contentContainerStyle={{ gap: 25 }}
        />
        <AudioActionsBottomSheet />
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
