import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "utils/colors";
import HomeScreen from "screens/HomeScreen";
import UploadScreen from "screens/UploadScreen";
import ProfileScreen from "screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC<any> = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.WARNING[500],
        tabBarInactiveTintColor: COLORS.MUTED[500],
        headerShown: false,
        tabBarBackground: () => <BlurView tint="dark" intensity={100} style={styles.blurView} />,
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
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
  },

  box: {
    width: "25%",
    height: "20%",
  },
  boxEven: {
    backgroundColor: "orangered",
  },
  boxOdd: {
    backgroundColor: "gold",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },

  tabBar: {
    position: "absolute",
    height: 80,
    borderRadius: 20,
    elevation: 0,
    borderTopWidth: 0,
    borderTopColor: "transparent",
    backgroundColor: "#18181b",
  },
  blurView: {
    borderRadius: 15,
  },
});
