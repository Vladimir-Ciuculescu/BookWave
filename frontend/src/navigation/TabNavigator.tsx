import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioPlayer from "components/AudioPlayer";
import MiniPlayer from "components/MiniPlayer";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { playerSelector } from "redux/reducers/player.reducer";
import FavoritesScreen from "screens/Favorites/FavoritesScreen";
import HomeScreen from "screens/Home/HomeScreen";
import PlayListsScreen from "screens/PlayLists/PlayListsScreen";
import ProfileScreen from "screens/Profile/ProfileScreen";
import UploadAudioScreen from "screens/UploadAudio/UploadScreen";
import { COLORS } from "utils/colors";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC<any> = () => {
  const { track, audio } = useSelector(playerSelector);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    return track
      ? () => {
          track.unloadAsync();
        }
      : undefined;
  }, [track]);

  return (
    <>
      {audio && <MiniPlayer />}
      <AudioPlayer />
      <Tab.Navigator
        screenOptions={{
          unmountOnBlur: true,
          tabBarActiveTintColor: COLORS.WARNING[500],
          tabBarInactiveTintColor: COLORS.MUTED[500],
          headerShown: false,
          tabBarBackground: () => <BlurView intensity={100} tint="dark" style={styles.blurView} />,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "ios-home" : "ios-home-outline"} size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused, color }) => <MaterialIcons name={focused ? "favorite" : "favorite-border"} size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Upload"
          component={UploadAudioScreen}
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "cloud-upload" : "cloud-upload-outline"} size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Playlists"
          component={PlayListsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={24} color={color} />,
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "ios-person" : "ios-person-outline"} size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: TAB_BAR_HEIGHT,
    borderRadius: 15,
    borderTopColor: "transparent",
  },
  blurView: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
});
