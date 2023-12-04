import PlayAudioCard from "components/PlayAudioCard";
import { useFetchFavorites } from "hooks/favorites.queries";
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList } from "react-native";

// TODO :  Currently testing favorites pagination request with filters and input text here

const PlayListsScreen: React.FC<any> = () => {
  const [step, setStep] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [limit, setLimit] = useState(5);
  const { data } = useFetchFavorites({ limit, pageNumber: 0 });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data || []}
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
