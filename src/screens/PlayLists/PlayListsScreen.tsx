import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import BWBottomSheet from "components/shared/BWBottomSheet";
import BWIconButton from "components/shared/BWIconButton";
import BWView from "components/shared/BWView";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { StatusBar } from "expo-status-bar";
import { useFetchPLaylistsTotalCount, useFetchPlaylistsByProfile } from "hooks/playlists.queries";
import { SafeAreaView } from "moti";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Keyboard, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chip, Dash, Text, TextField, TextFieldRef } from "react-native-ui-lib";
import AddPlayList from "screens/Home/components/AddPlayList";
import { PlayList } from "types/interfaces/playlists";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../assets/illustrations";
import PlayListCard from "./PlayListCard";
import PlayListOptions from "./components/PlayListOptions";

const { width } = Dimensions.get("screen");

const PlayListsScreen: React.FC<any> = () => {
  const [searchMode, toggleSearchMode] = useState<boolean>(false);
  const [playlistBottomSheet, togglePlaylistsBottomSheet] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [searchText, setSeachText] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [playlists, setPlaylists] = useState<PlayList[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const [optionsModal, toggleOptionsModal] = useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlayList>();
  const [total, setTotal] = useState<number>(0);

  const textRef = useRef<TextFieldRef>(null);
  const { data, isLoading, refetch, isFetching } = useFetchPlaylistsByProfile({ title: searchText, pageNumber: (pageNumber - 1).toString() });
  const { data: totalCount } = useFetchPLaylistsTotalCount({ title: searchText });

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
          setPlaylists([]);
        } else {
          setReachedEnd(true);
          return;
        }
      } else {
        setPlaylists(pageNumber === 1 ? [...data] : [...playlists, ...data]);
      }
    }

    setReachedEnd(false);
  }, [data]);

  useEffect(() => {
    setTotal(totalCount);
  }, [totalCount]);

  useEffect(() => {
    if (!title && !searchMode) {
      setSeachText(title);
      return;
    }

    const debounceTitle = setTimeout(() => {
      setPageNumber(1);
      setSeachText(title);
    }, 500);

    return () => clearTimeout(debounceTitle);
  }, [title]);

  const fetchNextPage = () => {
    if (reachedEnd) {
      return;
    }

    if (!isFetching && !isLoading) {
      setPageNumber((prevValue) => prevValue + 1);
    }
  };
  const clearSearch: any = () => {
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

  const closeModal = () => {
    toggleOptionsModal(false);
  };

  const openOptionsModal = (playlist: PlayList) => {
    toggleOptionsModal(true);
    setSelectedPlaylist(playlist);
  };

  const removePlaylist = (id: string) => {
    setPlaylists((oldValue: PlayList[]) => oldValue.filter((item) => item._id !== id));
    setTotal((oldValue: number) => oldValue - 1);
  };

  const addPlaylistToUI = (playlist: any) => {
    setPlaylists((oldValue) => [playlist, ...oldValue]);
    setTotal((oldValue) => oldValue + 1);
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
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
                {isLoading ? (
                  <View style={{ marginTop: 50 }}>
                    <ActivityIndicator color={COLORS.WARNING[500]} size="large" style={styles.loadinngSpinner} />
                  </View>
                ) : !playlists.length ? (
                  <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
                    <NoResultsFound width="100%" height={250} />
                    <BWView column alignItems="center" gap={10}>
                      <Text style={styles.notFoundTitle}>Not found</Text>
                      <Text style={styles.notFoundDescription}>Sorry, no results found. Please try again or type anything else</Text>
                    </BWView>
                  </BWView>
                ) : (
                  <FlatList
                    onEndReached={fetchNextPage}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    data={playlists}
                    renderItem={({ item }) => <PlayListCard onSelect={() => openOptionsModal(item)} style={{ paddingHorizontal: 20 }} playlist={item} />}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={[styles.searchingListContainer]}
                  />
                )}
              </BWView>
            </View>
          </View>
        ) : (
          <BWView column gap={24} style={styles.viewContainer}>
            <BWView row alignItems="center" gap={20} justifyContent="space-between" style={{ paddingHorizontal: 20 }}>
              <BWView row alignItems="center" gap={20}>
                <Entypo name="folder-music" size={45} color={COLORS.WARNING[500]} />

                <Text style={styles.title}>Playlists</Text>
              </BWView>
              <BWIconButton onPress={() => toggleSearchMode(true)} icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />} link />
            </BWView>
            {searchText && (
              <BWView row style={{ paddingHorizontal: 20 }}>
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
            <View style={styles.flex}>
              <BWView column gap={15}>
                {playlists && playlists.length ? (
                  <BWView column gap={16}>
                    <BWView row justifyContent="space-between" style={{ paddingHorizontal: 20 }}>
                      <Text style={styles.playlistsCount}>{total} playlists</Text>
                    </BWView>
                    <Dash thickness={2} length={width - 20} color={COLORS.MUTED[700]} containerStyle={{ alignSelf: "center" }} />

                    <FlatList
                      refreshControl={<RefreshControl tintColor={COLORS.WARNING[400]} refreshing={refresh} onRefresh={refreshList} />}
                      onEndReached={fetchNextPage}
                      initialNumToRender={20}
                      onEndReachedThreshold={0.1}
                      data={playlists}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => <PlayListCard onSelect={() => openOptionsModal(item)} style={{ paddingHorizontal: 20 }} playlist={item} />}
                      keyExtractor={(_, index) => index.toString()}
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
              </BWView>
            </View>
          </BWView>
        )}
        <BWIconButton
          onPress={() => togglePlaylistsBottomSheet(true)}
          icon={() => <AntDesign name="plus" size={30} color={COLORS.MUTED[50]} />}
          style={styles.plusBtn}
        />
        <BWBottomSheet height="80%" visible={playlistBottomSheet} blurBackground onPressOut={() => togglePlaylistsBottomSheet(false)} keyboardOffSet={1.5}>
          <AddPlayList onAdd={addPlaylistToUI} onClose={() => togglePlaylistsBottomSheet(false)} />
        </BWBottomSheet>
        <BWBottomSheet height="50%" visible={optionsModal} blurBackground onPressOut={closeModal}>
          <PlayListOptions playlist={selectedPlaylist} onClose={closeModal} onRemove={removePlaylist} />
        </BWBottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default PlayListsScreen;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
  },

  flex: {
    flex: 1,
  },

  title: {
    color: COLORS.MUTED[50],
    fontFamily: "MinomuBold",
    fontSize: 26,
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

  playlistsCount: {
    fontFamily: "MinomuBold",
    color: COLORS.MUTED[50],
    fontSize: 18,
  },
  test: {
    fontFamily: "MinomuBold",
    color: COLORS.WARNING[500],
    fontSize: 18,
  },

  searchingListContainer: {
    gap: 20,
    paddingBottom: TAB_BAR_HEIGHT + 100,
  },

  listContainer: {
    gap: 20,
    paddingBottom: TAB_BAR_HEIGHT * 2 + 100,
  },

  editContainer: {
    flex: 1,
    paddingTop: 20,
    gap: 24,
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

  plusBtn: {
    position: "absolute",
    bottom: TAB_BAR_HEIGHT + 20,
    right: 20,
    zIndex: 1,
    width: 60,
    height: 60,
    backgroundColor: COLORS.WARNING[500],
  },
});
