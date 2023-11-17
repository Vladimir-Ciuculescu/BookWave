import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import BWView from "components/shared/BWView";
import { COLORS } from "utils/colors";
import { FontAwesome, Feather } from "@expo/vector-icons";
import BWIconButton from "components/shared/BWIconButton";
import { useFetchFavorites } from "hooks/favorites.queries";
import BWDivider from "components/shared/BWDivider";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import PlayAudioCard from "components/PlayAudioCard";

const FavoritesScreen: React.FC<any> = () => {
  const { data } = useFetchFavorites();

  console.log(111, data);

  let copy;

  if (data) {
    copy = data.concat(data).concat(data);
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      {/* Your components on top */}
      <BWView column gap={24} style={{ flex: 1, paddingHorizontal: 30, paddingTop: 20 }}>
        <BWView row justifyContent="space-between">
          <BWView row alignItems="center" gap={20}>
            <FontAwesome name="music" size={45} color={COLORS.WARNING[500]} />
            <Text style={{ color: COLORS.MUTED[50], fontFamily: "MinomuBold", fontSize: 26 }}>
              Favorites
            </Text>
          </BWView>
          <BWIconButton
            onPress={() => {}}
            icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />}
            link
          />
        </BWView>
        <View style={{ flex: 1 }}>
          {data && (
            <BWView column gap={15}>
              <BWView row justifyContent="space-between">
                <Text style={{ fontFamily: "MinomuBold", color: COLORS.MUTED[50], fontSize: 18 }}>
                  {data.length} favorites
                </Text>
                <Text
                  style={{ fontFamily: "MinomuBold", color: COLORS.WARNING[500], fontSize: 18 }}
                >
                  Test button
                </Text>
              </BWView>
              <BWDivider
                orientation="horizontal"
                thickness={1.5}
                width="100%"
                color={COLORS.MUTED[700]}
              />
              <FlatList
                showsVerticalScrollIndicator={false}
                data={copy}
                renderItem={({ item }) => <PlayAudioCard audio={item} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
              />
            </BWView>
          )}
        </View>
      </BWView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
});
