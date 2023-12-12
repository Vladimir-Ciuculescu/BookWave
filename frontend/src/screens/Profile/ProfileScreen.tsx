import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Button, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import HistoryTab from "screens/Profile/Tabs/HistoryTab";
import { COLORS } from "utils/colors";
import ProfileInfo from "./components/ProfileInfo";
import AudiosTab from "screens/Profile/Tabs/AudiosTab";
import { authSelector } from "redux/reducers/auth.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";

const { width } = Dimensions.get("screen");

const Tab = createMaterialTopTabNavigator();

interface ProfileScreenProps {
  navigation: NavigationProp<StackNavigatorProps>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { profile } = useSelector(authSelector);

  const logOut = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Button label="Log out" onPress={logOut} /> */}
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
