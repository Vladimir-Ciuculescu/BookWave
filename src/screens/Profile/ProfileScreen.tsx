import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "redux/reducers/auth.reducer";
import AudiosTab from "screens/Profile/Tabs/Audios/AudiosTab";
import HistoryTab from "screens/Profile/Tabs/History/HistoryTab";
import { COLORS } from "utils/colors";
import ProfileInfo from "./components/ProfileInfo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { toggleNewPlaylistBottomSheetAction, toggleOptionBottomSheetsAction, togglePlaylistsBottomSheetAction } from "redux/reducers/audio-actions.reducer";

const { width } = Dimensions.get("screen");

const Tab = createMaterialTopTabNavigator();

const ProfileScreen: React.FC<any> = () => {
  const { profile } = useSelector(authSelector);
  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.addListener("blur", (e) => {
      dispatch(toggleOptionBottomSheetsAction(false));
      dispatch(togglePlaylistsBottomSheetAction(false));
      dispatch(toggleNewPlaylistBottomSheetAction(false));
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingTop: 30, gap: 20, justifyContent: "center", display: "flex" }}>
        <ProfileInfo profile={profile} />
        <Tab.Navigator
          style={{ width: width, alignSelf: "center" }}
          screenOptions={{
            tabBarActiveTintColor: COLORS.WARNING[500],
            tabBarInactiveTintColor: COLORS.MUTED[500],
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabBarItem,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarIndicatorStyle: styles.tabBarIndicator,
            tabBarIndicatorContainerStyle: styles.tabBarIndicatorContainer,
          }}
        >
          <Tab.Screen name="Audios" component={AudiosTab} />

          <Tab.Screen name="History" component={HistoryTab} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
  },

  tabBarItem: {
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderWidth: 2,
    zIndex: 0,
  },
  tabBarLabel: {
    textTransform: "none",
    fontFamily: "MinomuBold",
    fontSize: 14,
  },
  tabBarIndicator: {
    borderColor: COLORS.WARNING[500],
    borderWidth: 1.2,
    marginBottom: -2,
    zIndex: 9999,
  },
  tabBarIndicatorContainer: {
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.DARK[300],

    borderWidth: 2,
  },
});
