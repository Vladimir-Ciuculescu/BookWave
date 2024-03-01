import axios from "axios";
import CharacterListItem from "components/CharacterListItem";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

const Rick_Morty_Screen = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("https://rickandmortyapi.com/api/character");

      console.log(111, data);

      setCharacters(data.results);
      setNextPage(data.info.next);
    };

    fetchData();
  }, []);

  const loadMore = async () => {
    const { data } = await axios.get(nextPage);

    // setCharacters(data.results);
    setCharacters([...characters, ...data.results]);
    setNextPage(data.info.next);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: "red", flex: 1, marginBottom: 100 }}>
        <FlatList
          //refreshing={true}
          //debug={true}
          //Do not use this prop unless you do crazy things with Flatlist (having thousands or even more items on FlatList)
          removeClippedSubviews
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ gap: 10, backgroundColor: "blue" }}
          contentContainerStyle={{ gap: 10 }}
          //initialNumToRender={2}
          refreshing={false}
          onRefresh={() => console.warn("Refreesh")}
          onEndReached={loadMore}
          onEndReachedThreshold={3}
          windowSize={10}
          data={characters || []}
          renderItem={({ item }) => <CharacterListItem character={item} />}
          ListFooterComponent={() => (
            <Text style={{ color: "white", fontSize: 20 }} onPress={() => loadMore()}>
              {nextPage}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Rick_Morty_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
});
