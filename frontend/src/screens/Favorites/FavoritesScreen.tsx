import { SafeAreaView, FlatList, StyleSheet, ScrollView, Keyboard, Pressable } from "react-native";
import { Chip, Text, TextField, View } from "react-native-ui-lib";
import BWView from "components/shared/BWView";
import { COLORS } from "utils/colors";
import { FontAwesome, Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import BWIconButton from "components/shared/BWIconButton";
import { useFetchFavorites } from "hooks/favorites.queries";
import BWDivider from "components/shared/BWDivider";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import PlayAudioCard from "components/PlayAudioCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "consts/categories";
import { Category } from "types/enums/categories.enum";
import { AudioFile } from "types/interfaces/audios";
import _, { filter } from "lodash";
import BWPressable from "components/shared/BWPressable";

const FavoritesScreen: React.FC<any> = () => {
  // const [favorites, setFavorites] = useState();
  // const [limit, setLimit] = useState(5);

  const [favoritesResults, setFavoritesResults] = useState<AudioFile[]>([]);
  const [searchMode, toggleSearchMode] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [text, setText] = useState<string>("");
  const textRef = useRef<any>(null);

  const { data } = useFetchFavorites(5);

  useEffect(() => {
    if (searchMode) {
      typing(text);
      textRef.current!.focus();
    }
  }, [searchMode]);

  const enableSearchMode = () => {
    toggleSearchMode(true);
  };

  const disableSearchMode = () => {
    toggleSearchMode(false);
  };

  const typing = (value: string) => {
    if (data) {
      setFavoritesResults(
        data.filter((favorite: AudioFile) =>
          favorite.title.toLowerCase().includes(value.toLocaleLowerCase()),
        ),
      );
    }
  };

  // const typing = (favorites:AudioFile[], value:String) => {
  //   return favorites.filter((favorite:AudioFile) => favorite.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  // }

  const debounceTyping = useCallback(_.debounce(typing, 500), []);

  const handleTyping = (value: string) => {
    setText(value);
    debounceTyping(value);
    //debounceTyping(value);
  };

  const goBackToViewMode = () => {
    disableSearchMode();
    setFavoritesResults([]);
  };

  const handleSearch = () => {
    disableSearchMode();
    typing(text);
  };

  const clearText = () => {
    goBackToViewMode();
    setText("");
    //setFavoritesResults([]);
  };

  const clearSearch = () => {
    goBackToViewMode();
    setText("");
    setFavoritesResults([]);
  };

  const toggleCategory = (category: Category) => {
    const isCategorySelected = selectedCategories.includes(category);

    setSelectedCategories((oldValue) =>
      isCategorySelected
        ? oldValue.filter((item: Category) => category !== item)
        : [...oldValue, category],
    );

    //disableSearchMode();
  };

  const removeCategory = (category: Category) => {
    setSelectedCategories((oldValue) => oldValue.filter((item: Category) => category !== item));
  };

  const FILTERING = (data: AudioFile[]) => {
    {
      return data.filter((favorite: AudioFile) =>
        favorite.title.toLowerCase().includes(text.toLocaleLowerCase()),
      );
    }
  };

  const debounceFilter = useCallback(_.debounce(FILTERING), []);

  const filteredResults = () => {
    let filteredData;

    if (data) {
      filteredData = data;
    }

    if (favoritesResults.length) {
      //filteredData = data;
      filteredData = favoritesResults;

      filteredData = filteredData.filter((favorite: AudioFile) =>
        favorite.title.toLowerCase().includes(text.toLocaleLowerCase()),
      );

      if (selectedCategories.length) {
        filteredData = filteredData.filter((favorite: AudioFile) => {
          return selectedCategories.includes(favorite.category);
        });
      }
    }

    //debounceFilter(filteredData);

    return filteredData;
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      {!searchMode ? (
        <BWView column gap={24} style={styles.viewContainer}>
          <BWView row justifyContent="space-between">
            <BWView row alignItems="center" gap={20}>
              <FontAwesome name="music" size={45} color={COLORS.WARNING[500]} />
              <Text style={styles.title}>Favorites</Text>
            </BWView>
            <BWIconButton
              onPress={enableSearchMode}
              icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />}
              link
            />
          </BWView>
          {text && favoritesResults.length > 0 && (
            <BWView row>
              <Chip
                borderRadius={22}
                label={`Results for: ${text}`}
                rightElement={
                  <BWIconButton
                    onPress={clearText}
                    style={{ backgroundColor: "transparent" }}
                    icon={() => <AntDesign name="close" size={20} color={COLORS.DARK[50]} />}
                  />
                }
                labelStyle={styles.resultsChipLabel}
                containerStyle={styles.resultsChipContainer}
              />
            </BWView>
          )}
          {selectedCategories.length > 0 && (
            <BWView column gap={10}>
              <Text style={{ color: COLORS.MUTED[50], fontFamily: "Minomu" }}>
                Categories applied:
              </Text>
              <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
                {selectedCategories.map((category: Category) => (
                  <Chip
                    key={category}
                    borderRadius={22}
                    label={category}
                    rightElement={
                      <BWIconButton
                        onPress={() => removeCategory(category)}
                        style={{ backgroundColor: "transparent" }}
                        icon={() => <AntDesign name="close" size={20} color={COLORS.DARK[50]} />}
                      />
                    }
                    labelStyle={styles.resultsChipLabel}
                    containerStyle={styles.resultsChipContainer}
                  />
                ))}
              </ScrollView>
            </BWView>
          )}
          <View style={styles.flex}>
            {data && (
              <BWView column gap={15}>
                <BWView row justifyContent="space-between">
                  <Text style={styles.favoritesCount}>
                    {/* {favoritesResults.length > 0 ? favoritesResults.length : data.length} favorites */}
                    {filteredResults().length} favorites
                  </Text>
                  <Text style={styles.test}>Test button</Text>
                </BWView>
                <BWDivider
                  orientation="horizontal"
                  thickness={1.5}
                  width="100%"
                  color={COLORS.MUTED[700]}
                />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  //data={favorites}
                  data={filteredResults()}
                  //data={favoritesResults.length > 0 ? favoritesResults : data}
                  //data={copy}
                  renderItem={({ item }) => <PlayAudioCard audio={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.listContainer}
                />
              </BWView>
            )}
          </View>
        </BWView>
      ) : (
        <View style={styles.editContainer} onTouchStart={Keyboard.dismiss}>
          <BWView row alignItems="center" gap={10} style={{ paddingHorizontal: 10 }}>
            <Pressable onPress={goBackToViewMode}>
              <Ionicons name="chevron-back-outline" size={24} color={COLORS.WARNING[500]} />
            </Pressable>
            <View style={styles.flex}>
              <TextField
                keyboardAppearance="dark"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                ref={textRef}
                value={text}
                onChangeText={handleTyping}
                style={styles.searchInput}
                leadingAccessory={
                  <View style={styles.leftIcon}>
                    <Feather name="search" size={22} color={COLORS.MUTED[50]} />
                  </View>
                }
                trailingAccessory={
                  <View style={styles.rightIcon}>
                    <BWIconButton
                      onPress={clearSearch}
                      icon={() => <Ionicons name="close" size={20} color={COLORS.WARNING[500]} />}
                      link
                    />
                  </View>
                }
                placeholder="Search..."
                placeholderTextColor={COLORS.MUTED[600]}
              />
            </View>
          </BWView>
          <View style={styles.flex}>
            {data && (
              <BWView column gap={15}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {categories.map((category: Category) => (
                    <BWPressable key={category} onPress={() => toggleCategory(category)}>
                      <Chip
                        //onPress={() => toggleCategory(category)}
                        key={category}
                        label={category}
                        labelStyle={[
                          selectedCategories.includes(category)
                            ? styles.selectedLabel
                            : styles.unselectedLabel,
                          styles.categoryLabel,
                        ]}
                        containerStyle={[
                          selectedCategories.includes(category)
                            ? styles.selectedContainer
                            : styles.unselectedContainer,
                          styles.categoryContainer,
                        ]}
                      />
                    </BWPressable>
                  ))}
                </ScrollView>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={filteredResults()}
                  //data={favoritesResults}
                  renderItem={({ item }) => <PlayAudioCard audio={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={[styles.listContainer, { paddingHorizontal: 10 }]}
                />
              </BWView>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },

  flex: {
    flex: 1,
  },

  viewContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  editContainer: {
    flex: 1,
    paddingTop: 20,
    gap: 24,
  },

  title: {
    color: COLORS.MUTED[50],
    fontFamily: "MinomuBold",
    fontSize: 26,
  },
  favoritesCount: {
    fontFamily: "MinomuBold",
    color: COLORS.MUTED[50],
    fontSize: 18,
  },
  test: {
    fontFamily: "MinomuBold",
    color: COLORS.WARNING[500],
    fontSize: 18,
  },
  searchInput: {
    height: 50,
    paddingRight: 16,
    paddingLeft: 50,
    color: COLORS.MUTED[300],
    borderRadius: 14,
    backgroundColor: COLORS.DARK[300],
    zIndex: 999,
  },
  leftIcon: {
    position: "absolute",
    zIndex: 1,
    left: 15,
  },
  rightIcon: {
    position: "absolute",
    right: 15,
  },

  categoriesContainer: {
    gap: 15,
    paddingHorizontal: 15,

    alignItems: "center",
    paddingVertical: 5,
  },

  categoryLabel: {
    fontFamily: "Minomu",
    fontSize: 14,
  },

  selectedLabel: {
    color: COLORS.MUTED[50],
  },

  unselectedLabel: {
    color: COLORS.WARNING[500],
  },

  categoryContainer: {
    height: 40,
    borderColor: COLORS.WARNING[500],
    borderWidth: 2,
  },

  selectedContainer: {
    backgroundColor: COLORS.WARNING[500],
  },

  unselectedContainer: {
    backgroundColor: "transparent",
  },

  resultsChipLabel: {
    color: COLORS.MUTED[50],
    fontSize: 14,
    fontFamily: "Minomu",
    marginHorizontal: 10,
  },

  resultsChipContainer: {
    backgroundColor: COLORS.WARNING[500],
    paddingHorizontal: 10,
    height: 40,
  },
});
