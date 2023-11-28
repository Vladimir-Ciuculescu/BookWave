import PlayAudioCard from "components/PlayAudioCard";
import { useFetchFavorites } from "hooks/favorites.queries";
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList } from "react-native";
import { Text, View } from "react-native-ui-lib";

// TODO :  Currently testing favorites pagination request with filters and input text here

const PlayListsScreen: React.FC<any> = () => {
  const [step, setStep] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const { data } = useFetchFavorites({ limit: 10, pageNumber: 0 });

  useEffect(() => {
    // const data = fetchPosts(10, step);
  }, []);

  // const fetchPosts = (limit: number, pageNumber: number) => {
  //   const { data } = useFetchFavorites({ limit, pageNumber });
  //   return data;
  // };

  // const { data } = useFetchFavorites({ limit: 10, pageNumber: step });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        //data={favorites}
        //data={data || []}
        //data={favoritesResults.length > 0 ? favoritesResults : data}
        //data={copy}
        renderItem={({ item }) => <PlayAudioCard audio={item} />}
        keyExtractor={(item, index) => index.toString()}
        // contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default PlayListsScreen;
