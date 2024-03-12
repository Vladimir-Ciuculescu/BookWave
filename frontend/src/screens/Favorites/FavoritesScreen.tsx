import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import AudioActionsBottomSheet from "components/AudioActionsBottomSheet";
import PlayCardTest from "components/PlayCardTest";
import BWDivider from "components/shared/BWDivider";
import BWIconButton from "components/shared/BWIconButton";
import BWView from "components/shared/BWView";
import { categories } from "consts/categories";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { StatusBar } from "expo-status-bar";
import { useFetchFavorites, useFetchFavoritesTotalCount } from "hooks/favorites.queries";
import useAudioController from "hooks/useAudioController";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useActiveTrack } from "react-native-track-player";
import { Chip, Text, TextField, TextFieldRef, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import { Category } from "types/enums/categories.enum";
import { AudioFile } from "types/interfaces/audios";
import { GetFavoritesRequest } from "types/interfaces/requests/favorites-requests.interfaces";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../assets/illustrations";
import Categories from "./Categories";

const FavoritesScreen: React.FC<any> = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [favorites, setFavorites] = useState<AudioFile[]>([]);
  const [searchMode, toggleSearchMode] = useState<boolean>(false);
  const [selectedCategories, toggleSelectedCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const textRef = useRef<TextFieldRef>(null);
  const flatListRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { audio } = useSelector(playerSelector);
  const { onAudioPress, isPlaying } = useAudioController();
  const track = useActiveTrack();

  const payload: GetFavoritesRequest = {
    pageNumber: (pageNumber - 1).toString(),
  };

  payload.title = searchText;

  if (selectedCategories.length) {
    payload.categories = selectedCategories.join(",");
  }

  const { data, refetch, isLoading, isFetching } = useFetchFavorites(payload);

  const { data: total } = useFetchFavoritesTotalCount({ title: searchText, categories: selectedCategories.join(",") });

  useEffect(() => {
    if (searchMode) {
      textRef.current!.focus();
      setPageNumber(1);
    }
  }, [searchMode]);

  useEffect(() => {
    if (data) {
      if (!data.length) {
        if (pageNumber === 1) {
          setFavorites([]);
        } else {
          setReachedEnd(true);
          return;
        }
      } else {
        setFavorites(pageNumber === 1 ? [...data] : [...favorites, ...data]);
      }
    }

    setReachedEnd(false);
  }, [data]);

  useEffect(() => {
    if (!title && !searchMode) {
      setSearchText(title);
      setPageNumber(1);
      return;
    }

    const debounceTitle = setTimeout(() => {
      setPageNumber(1);
      setSearchText(title);
    }, 500);

    return () => clearTimeout(debounceTitle);
  }, [title]);

  useEffect(() => {
    setPageNumber(1);

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [selectedCategories]);

  const fetchNextPage = () => {
    if (reachedEnd) {
      return;
    }

    if (!isFetching && !isLoading) {
      setPageNumber((prevValue) => prevValue + 1);
    }
  };

  const clearSearch = () => {
    toggleSearchMode(false);
    setTitle("");
  };

  const refreshList = () => {
    setRefresh(true);

    if (pageNumber === 1) {
      refetch();
    } else {
      setPageNumber(1);
    }

    if (!isFetching && !isLoading) {
      setRefresh(false);
    }
  };

  const toggleCategory = (category: Category) => {
    const isCategorySelected = selectedCategories.includes(category);

    toggleSelectedCategories((oldValues) => (isCategorySelected ? oldValues.filter((item: Category) => category !== item) : [...oldValues, category]));
  };

  const removeCategory = (category: Category) => {
    toggleSelectedCategories((oldValues) => oldValues.filter((item: Category) => category !== item));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                  onChangeText={setTitle}
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
                ) : !favorites.length ? (
                  <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
                    <NoResultsFound width="100%" height={250} />
                    <BWView column alignItems="center" gap={10}>
                      <Text style={styles.notFoundTitle}>Not found</Text>
                      <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
                    </BWView>
                  </BWView>
                ) : (
                  <FlatList
                    ref={flatListRef}
                    onEndReached={fetchNextPage}
                    initialNumToRender={20}
                    windowSize={20}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    data={favorites}
                    renderItem={({ item }) => (
                      <PlayCardTest isPlaying={isPlaying && track! && track!.id === item.id} audio={item} onPress={() => onAudioPress(item, favorites)} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.searchingListContainer}
                  />
                )}
              </BWView>
            </View>
          </View>
        ) : (
          <BWView column gap={24} style={styles.viewContainer}>
            <BWView style={{ paddingHorizontal: 20 }} row justifyContent="space-between">
              <BWView row alignItems="center" gap={20}>
                <FontAwesome name="music" size={45} color={COLORS.WARNING[500]} />
                <Text style={styles.title}>Favorites</Text>
              </BWView>
              <BWIconButton onPress={() => toggleSearchMode(true)} icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />} link />
            </BWView>
            {title && (
              <BWView row style={{ paddingHorizontal: 15 }}>
                <Chip
                  borderRadius={22}
                  label={`Results for: ${title}`}
                  rightElement={
                    <BWIconButton
                      onPress={clearSearch}
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
              <BWView column gap={20}>
                <Text style={styles.categoriesApplied}>Categories applied:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
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
            <View style={[styles.flex, { paddingHorizontal: 15 }]}>
              {favorites && favorites.length ? (
                <BWView column gap={15}>
                  <BWView row justifyContent="space-between">
                    <Text style={styles.favoritesCount}>{total} favorites</Text>
                  </BWView>

                  <BWDivider orientation="horizontal" thickness={1.5} width="100%" color={COLORS.MUTED[700]} />

                  <FlatList
                    refreshControl={<RefreshControl tintColor={COLORS.WARNING[400]} refreshing={refresh} onRefresh={refreshList} />}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={1}
                    initialNumToRender={20}
                    showsVerticalScrollIndicator={false}
                    data={favorites}
                    renderItem={({ item }) => (
                      <PlayCardTest isPlaying={isPlaying && track! && track!.id === item.id} audio={item} onPress={() => onAudioPress(item, favorites)} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                  />
                </BWView>
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
          </BWView>
        )}
        <AudioActionsBottomSheet optionsBottomSheetOffSet="58%" playlistsBottomSheetOffset="60%" newPlaylistBottomSheetOffset="90%" list={favorites} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 100,
    paddingHorizontal: 10,
  },

  searchingListContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 110,
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
  },

  viewContainer: {
    flex: 1,
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
    paddingHorizontal: 20,
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
