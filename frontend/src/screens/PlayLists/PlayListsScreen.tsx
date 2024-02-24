import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import BWBottomSheet from "components/shared/BWBottomSheet";
import BWDivider from "components/shared/BWDivider";
import BWIconButton from "components/shared/BWIconButton";
import BWView from "components/shared/BWView";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { StatusBar } from "expo-status-bar";
import { useFetchPlaylistsByProfile } from "hooks/playlists.queries";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, TextField, TextFieldRef } from "react-native-ui-lib";
import AddPlayList from "screens/Home/components/AddPlayList";
import { COLORS } from "utils/colors";
import { NoResultsFound } from "../../../assets/illustrations";
import PlayListCard from "./PlayListCard";

const PlayListsScreen: React.FC<any> = () => {
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [playlistBottomSheet, togglePlaylistsBottomSheet] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const textRef = useRef<TextFieldRef>(null);
  const { data, refetch, isLoading } = useFetchPlaylistsByProfile({ title });

  const clearSearch: any = () => {
    setSearchMode(false);
    setTitle("");
  };

  useEffect(() => {
    if (searchMode) {
      textRef.current!.focus();
    }
  }, [searchMode]);

  const debounceTyping = useCallback(
    _.debounce(() => refetch(), 500),
    [],
  );

  const handleTyping = (value: string) => {
    setTitle(value);
    debounceTyping();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        {searchMode ? (
          <View style={styles.editContainer} onTouchStart={Keyboard.dismiss}>
            <BWView row alignItems="center" gap={10} style={{ paddingHorizontal: 10 }}>
              <Pressable onPress={() => setSearchMode(false)}>
                <Ionicons name="chevron-back-outline" size={24} color={COLORS.WARNING[500]} />
              </Pressable>
              <View style={styles.flex}>
                <TextField
                  keyboardAppearance="dark"
                  returnKeyType="search"
                  onSubmitEditing={() => setSearchMode(false)}
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
              <BWView column gap={15}>
                {isLoading ? (
                  <View style={{ marginTop: 50 }}>
                    <ActivityIndicator
                      color={COLORS.WARNING[500]}
                      size="large"
                      style={styles.loadinngSpinner}
                    />
                  </View>
                ) : !data.length ? (
                  <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
                    <NoResultsFound width="100%" height={250} />
                    <BWView column alignItems="center" gap={10}>
                      <Text style={styles.notFoundTitle}>Not found</Text>
                      <Text style={styles.notFoundDescription}>
                        Sorry, no results found. Please try again or type anything else
                      </Text>
                    </BWView>
                  </BWView>
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data}
                    renderItem={({ item }) => <PlayListCard playlist={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={[styles.listContainer, { paddingHorizontal: 10 }]}
                  />
                )}
              </BWView>
            </View>
          </View>
        ) : (
          <BWView column gap={24} style={styles.viewContainer}>
            <BWView row alignItems="center" gap={20} justifyContent="space-between">
              <Text style={styles.title}>Playlists</Text>
              <BWIconButton
                onPress={() => setSearchMode(true)}
                icon={() => <Feather name="search" size={26} color={COLORS.MUTED[50]} />}
                link
              />
            </BWView>
            {data && (
              <BWView column gap={16}>
                <BWView row justifyContent="space-between">
                  <Text style={styles.playlistsCount}>{data.length} playlists</Text>
                  <Text style={styles.test}>Filter</Text>
                </BWView>
                <BWDivider
                  orientation="horizontal"
                  thickness={1.5}
                  width="100%"
                  color={COLORS.MUTED[700]}
                />

                {data.length ? (
                  <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PlayListCard playlist={item} />}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                  />
                ) : (
                  <BWView alignItems="center" column gap={25} style={{ paddingTop: 30 }}>
                    <NoResultsFound width="100%" height={250} />
                    <BWView column alignItems="center" gap={10}>
                      <Text style={styles.notFoundTitle}>Not found</Text>
                      <Text style={styles.notFoundDescription}>
                        Sorry, no results found. Please try again or type anything else
                      </Text>
                    </BWView>
                  </BWView>
                )}
              </BWView>
            )}
          </BWView>
        )}
        <BWIconButton
          onPress={() => togglePlaylistsBottomSheet(true)}
          icon={() => <AntDesign name="plus" size={30} color={COLORS.MUTED[50]} />}
          style={{
            position: "absolute",
            bottom: TAB_BAR_HEIGHT + 20,
            right: 20,
            zIndex: 1,
            width: 60,
            height: 60,
            backgroundColor: COLORS.WARNING[500],
          }}
        />
        <BWBottomSheet
          height="80%"
          visible={playlistBottomSheet}
          blurBackground
          onPressOut={() => togglePlaylistsBottomSheet(false)}
          keyboardOffSet={1.5}
        >
          <AddPlayList onClose={() => togglePlaylistsBottomSheet(false)} />
        </BWBottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default PlayListsScreen;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingHorizontal: 30,
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
  listContainer: {
    gap: 15,
    paddingBottom: TAB_BAR_HEIGHT + 40,
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
});
