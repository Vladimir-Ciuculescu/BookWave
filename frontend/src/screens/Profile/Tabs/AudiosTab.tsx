import PlayAudioCard from "components/PlayAudioCard";
import BWDivider from "components/shared/BWDivider";
import BWView from "components/shared/BWView";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { useFetchAudiosByProfile } from "hooks/audios.queries";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

const AudiosTab = () => {
  const { data } = useFetchAudiosByProfile();

  let copy;

  if (data) {
    copy = data;
  }

  return (
    <View style={styles.container}>
      <BWView column gap={15}>
        {data && (
          <>
            <Text style={styles.audioCounter}>{data.length} audios</Text>
            <BWDivider orientation="horizontal" thickness={1.5} width="100%" color={COLORS.MUTED[700]} />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={copy}
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PlayAudioCard onPress={() => {}} audio={item} />}
            />
          </>
        )}
      </BWView>
    </View>
  );
};

export default AudiosTab;

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
});
