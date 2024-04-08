import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error: any) {
    console.log(error);
  }
};
