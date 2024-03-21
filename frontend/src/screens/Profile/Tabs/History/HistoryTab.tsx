import { useFetchHistory } from "hooks/history.queries";
import { FlatList, StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import HistoryItem from "./components/HistoryItem";

const HistoryTab = () => {
  const { data } = useFetchHistory();

  return (
    <View style={styles.container}>
      {data && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          contentContainerStyle={{ gap: 25 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <HistoryItem audios={item.audios} date={item.date} />}
        />
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
});
