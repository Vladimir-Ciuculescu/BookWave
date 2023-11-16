import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "utils/colors";
import HomeScreen from "screens/HomeScreen";
import UploadScreen from "screens/UploadScreen";
import ProfileScreen from "screens/ProfileScreen";
import { TAB_BAR_HEIGHT } from "consts/dimensions";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC<any> = () => {
  return (
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
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "ios-home" : "ios-home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "cloud-upload" : "cloud-upload-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "ios-person" : "ios-person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
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
