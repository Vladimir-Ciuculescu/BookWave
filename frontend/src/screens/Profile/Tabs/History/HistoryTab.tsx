import { useIsFocused } from "@react-navigation/native";
import BWView from "components/shared/BWView";
import { useFetchHistory } from "hooks/history.queries";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../../../assets/illustrations/index";
import HistoryItem from "./components/HistoryItem";

const HistoryTab = () => {
  const isFocused = useIsFocused();

  //@ts-ignore
  const { data, isLoading } = useFetchHistory({ isFocused });

  const [audios, setAudios] = useState([]);

  useEffect(() => {
    if (data && data.length) {
      setAudios(data);
      return;
    }

    setAudios([]);
  }, [data]);

  const removeFromHistory = (audioId: string) => {
    //@ts-ignore
    if (audios.length === 1 && audios[0].audios.length === 1) {
      setAudios([]);
      return;
    }

    setAudios((oldValue: any) => oldValue.map((item: any) => ({ ...item, audios: item.audios.filter((audio: any) => audio.audioId !== audioId) })));
  };

  return (
    <View style={styles.container}>
      {audios.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={audios}
          contentContainerStyle={{ gap: 25, paddingBottom: "20%" }}
          keyExtractor={(_, index) => index.toString()}
          //@ts-ignore
          renderItem={({ item }) => <HistoryItem onPress={removeFromHistory} audios={item.audios} date={item.date} />}
        />
      ) : (
        <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
          <NoResultsFound width="100%" height={250} />
          <BWView column alignItems="center" gap={10}>
            <Text style={styles.notFoundTitle}>Not found</Text>
            <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
          </BWView>
        </BWView>
      )}
    </View>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  notFoundTitle: {
    fontFamily: "MinomuBold",
    fontSize: 22,
    color: COLORS.MUTED[50],
  },

  notFoundDescription: {
    fontFamily: "Minomu",
    fontSize: 16,
    color: COLORS.MUTED[400],
    textAlign: "center",
  },
});
