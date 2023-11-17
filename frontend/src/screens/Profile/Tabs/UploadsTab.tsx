import { FlatList, StyleSheet } from "react-native";
import { useFetchAudiosByProfile } from "hooks/queries";
import { Text, View } from "react-native-ui-lib";
import { AudioFile } from "types/interfaces/audios";
import BWView from "components/shared/BWView";
import BWImage from "components/shared/BWImage";
import { COLORS } from "utils/colors";
import BWIconButton from "components/shared/BWIconButton";
import { Ionicons } from "@expo/vector-icons";
import BWDivider from "components/shared/BWDivider";
import { TAB_BAR_HEIGHT } from "consts/dimensions";

interface PlayAudioCardProps {
  audio: AudioFile;
}

const PlayAudioCard: React.FC<PlayAudioCardProps> = ({ audio }) => {
  return (
    <BWView row justifyContent="space-between" alignItems="center" style={{ height: 80 }}>
      <BWView row gap={20}>
        <BWImage
          src={audio.poster}
          style={styles.audioImage}
          placeholder={!audio.poster}
          iconName="music"
          iconSize={40}
        />
        <BWView column style={{ height: "100%" }} justifyContent="space-evenly">
          <Text style={styles.audioTitle}>{audio.title}</Text>
          <BWView row>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.audioDescription}>
              {audio.about}
            </Text>
            {/* prettier-ignore */}
            <Text style={styles.audioDuration}>
              {" "}
              | 03:50 mins
            </Text>
          </BWView>
        </BWView>
      </BWView>
      <BWIconButton
        onPress={() => {}}
        style={styles.playBtn}
        icon={() => <Ionicons name="md-play" size={16} color="black" />}
      />
    </BWView>
  );
};

const UploadsTab = () => {
  const { data, isLoading } = useFetchAudiosByProfile();

  return (
    <View style={styles.container}>
      <BWView column gap={15}>
        {data && (
          <>
            <Text style={styles.audioCounter}>{data.length} audios</Text>
            <BWDivider
              orientation="horizontal"
              thickness={1.5}
              width="100%"
              color={COLORS.MUTED[700]}
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PlayAudioCard audio={item} />}
            />
          </>
        )}
      </BWView>
    </View>
  );
};

export default UploadsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  audioCounter: {
    color: COLORS.MUTED[50],
    fontFamily: "MinomuBold",
    fontSize: 22,
  },
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },

  audioImage: {
    height: 80,
    width: 80,
    borderRadius: 24,
  },

  audioTitle: {
    color: COLORS.MUTED[50],
    fontSize: 18,
    fontFamily: "MinomuBold",
  },

  audioDescription: {
    maxWidth: 100,
    color: COLORS.MUTED[500],
    fontFamily: "Minomu",
    fontSize: 14,
  },

  audioDuration: {
    color: COLORS.MUTED[500],
    fontFamily: "Minomu",
    fontSize: 14,
  },

  playBtn: { height: 30, width: 30, borderRadius: 50, backgroundColor: COLORS.WARNING[500] },
});
