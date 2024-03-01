import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import PlayAudioCard from "components/PlayAudioCard";
import BWDivider from "components/shared/BWDivider";
import BWIconButton from "components/shared/BWIconButton";
import BWView from "components/shared/BWView";
import { categories } from "consts/categories";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { StatusBar } from "expo-status-bar";
import { useFetchFavorites } from "hooks/favorites.queries";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Chip, Text, TextField, TextFieldRef, View } from "react-native-ui-lib";
import { Category } from "types/enums/categories.enum";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../assets/illustrations";
import Categories from "./Categories";

const FavoritesScreen: React.FC<any> = () => {
  const LIMIT = 10;

  const [index, setIndex] = useState(0);

  const [searchMode, toggleSearchMode] = useState<boolean>(false);
  const [selectedCategories, toggleSelectedCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState<string>("");
  const textRef = useRef<TextFieldRef>(null);

  const { data, refetch, isLoading } = useFetchFavorites({
    limit: LIMIT,
    pageNumber: index,
    title,
    categories: selectedCategories.join(","),
  });

  useEffect(() => {
    if (searchMode) {
      textRef.current!.focus();
    }
  }, [searchMode]);

  useEffect(() => {
    if (!title) {
      refetch();
    }
  }, [title]);

  const debounceTyping = useCallback(
    _.debounce(() => refetch(), 500),
    [],
  );

  const handleTyping = (value: string) => {
    setTitle(value);
    debounceTyping();
  };

  const clearText = () => {
    toggleSearchMode(false);
    setTitle("");
  };

  const clearSearch = () => {
    toggleSearchMode(false);
    setTitle("");
  };

  const toggleCategory = (category: Category) => {
    const isCategorySelected = selectedCategories.includes(category);

    toggleSelectedCategories((oldValues) => (isCategorySelected ? oldValues.filter((item: Category) => category !== item) : [...oldValues, category]));
  };

  const removeCategory = (category: Category) => {
    toggleSelectedCategories((oldValues) => oldValues.filter((item: Category) => category !== item));
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      <StatusBar style="light" />
      {searchMode ? (
        <View style={styles.editContainer} onTouchStart={Keyboard.dismiss}>
          <BWView row alignItems="center" gap={10} style={{ paddingHorizontal: 10 }}>
            <Pressable onPress={() => toggleSearchMode(false)}>
              <Ionicons name="chevron-back-outline" size={24} color={COLORS.WARNING[500]} />
            </Pressable>
            <View style={styles.flex}>
              <TextField
                keyboardAppearance="dark"
                returnKeyType="search"
                onSubmitEditing={() => toggleSearchMode(false)}
                ref={textRef}
                value={title}
                onChangeText={handleTyping}
                style={styles.searchInput}
                leadingAccessory={
                  <View style={styles.leftIcon}>
                    <Feather name="search" size={22} color={COLORS.MUTED[50]} />
                  </View>
                }
                trailingAccessory={
                  <View style={styles.rightIcon}>
                    <BWIconButton onPress={clearSearch} icon={() => <Ionicons name="close" size={20} color={COLORS.WARNING[500]} />} link />
                  </View>
                }
                placeholder="Search..."
                placeholderTextColor={COLORS.MUTED[600]}
              />
            </View>
          </BWView>
          <View style={styles.flex}>
            <BWView column gap={15}>
              <Categories selectedCategories={selectedCategories} categories={categories} onToggle={toggleCategory} />
              {isLoading ? (
                <View style={{ marginTop: 50 }}>
                  <ActivityIndicator color={COLORS.WARNING[500]} size="large" style={styles.loadinngSpinner} />
                </View>
              ) : !data.length ? (
                <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
                  <NoResultsFound width="100%" height={250} />
                  <BWView column alignItems="center" gap={10}>
                    <Text style={styles.notFoundTitle}>Not found</Text>
                    <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
                  </BWView>
                </BWView>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  renderItem={({ item }) => <PlayAudioCard audio={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={[styles.listContainer, { paddingHorizontal: 10 }]}
                />
              )}
            </BWView>
          </View>
        </View>
      ) : (
        <BWView column gap={24} style={styles.viewContainer}>
          <BWView row justifyContent="space-between">
            <BWView row alignItems="center" gap={20}>
              <FontAwesome name="music" size={45} color={COLORS.WARNING[500]} />
              <Text style={styles.title}>Favorites</Text>
            </BWView>
            <BWIconButton onPress={() => toggleSearchMode(true)} icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />} link />
          </BWView>
          {title && (
            <BWView row>
              <Chip
                borderRadius={22}
                label={`Results for: ${title}`}
                rightElement={
                  <BWIconButton
                    onPress={clearText}
                    style={{ backgroundColor: "transparent" }}
                    icon={() => <AntDesign name="close" size={20} color={COLORS.MUTED[50]} />}
                  />
                }
                labelStyle={styles.resultsChipLabel}
                containerStyle={styles.resultsChipContainer}
              />
            </BWView>
          )}
          {selectedCategories.length > 0 && (
            <BWView column gap={10}>
              <Text style={styles.categoriesApplied}>Categories applied:</Text>
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
                        icon={() => <AntDesign name="close" size={20} color={COLORS.MUTED[50]} />}
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
                  <Text style={styles.favoritesCount}>{data.length} favorites</Text>
                  <Text style={styles.test}>Test button</Text>
                </BWView>

                <BWDivider orientation="horizontal" thickness={1.5} width="100%" color={COLORS.MUTED[700]} />
                {data.length ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data}
                    renderItem={({ item }) => <PlayAudioCard audio={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
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
              </BWView>
            )}
          </View>
        </BWView>
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

  categoriesApplied: {
    color: COLORS.MUTED[50],
    fontFamily: "Minomu",
  },
  loadinngSpinner: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
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
