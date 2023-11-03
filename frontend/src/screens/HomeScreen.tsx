import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

const HomeScreen: React.FC<any> = () => {
  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <ScrollView>
        <View style={{ backgroundColor: COLORS.WARNING[500], height: 200, width: 200 }}></View>
        <View style={{ backgroundColor: COLORS.WARNING[500], height: 200, width: 200 }}></View>
        <View style={{ backgroundColor: COLORS.WARNING[500], height: 200, width: 200 }}></View>
        <View style={{ backgroundColor: COLORS.WARNING[500], height: 200, width: 200 }}></View>
        <View style={{ backgroundColor: COLORS.WARNING[500], height: 200, width: 200 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
