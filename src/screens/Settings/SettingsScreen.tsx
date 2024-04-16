import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HistoryService from "api/history.api";
import UserService from "api/users.api";
import BWButton from "components/shared/BWButton";
import BWForm from "components/shared/BWForm";
import BWIconButton from "components/shared/BWIconButton";
import BWImage from "components/shared/BWImage";
import BWInput from "components/shared/BWInput";
import BWSubmitButton from "components/shared/BWSubmitButton";
import BWView from "components/shared/BWView";
import * as ImagePicker from "expo-image-picker";
import { useLayoutEffect, useState } from "react";
import { Alert, AlertButton, AlertOptions, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setLoggedInAction, setProfileAction } from "redux/reducers/auth.reducer";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { RemoveHistoryRequest } from "types/interfaces/requests/history-requests.interfaces";
import { COLORS } from "utils/colors";
import { updateProfileSchema } from "yup/app.schemas";
import Action from "./components/Action";
import Section from "./components/Section";

interface ProfileData {
  name: string;
  avatar?: string;
  email: string;
}

interface AlertProps {
  title: string;
  message: string;
  buttons?: AlertButton[];
  options?: AlertOptions;
}

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorProps, "Settings", undefined>;
  route: RouteProp<StackNavigatorProps, "Settings">;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const {
    params: { profile },
  } = route;

  const initialValues: ProfileData = {
    name: profile.name,
    avatar: profile.avatar,
    email: profile.email,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [updateProfileError, setUpdateProfileError] = useState<string>("");

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BWIconButton style={{ marginRight: 3 }} link onPress={closeSettings} icon={() => <AntDesign name="close" size={24} color={COLORS.MUTED[50]} />} />
      ),
    });
  }, [navigation]);

  const closeSettings = () => {
    navigation.goBack();
  };

  const pickImage = async (setFieldValue: (label: string, value: string) => void) => {
    let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("avatar", result.assets![0].uri);
    }
  };

  const updateProfile = async (values: ProfileData) => {
    const { name, email, avatar } = values;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (avatar) {
        formData.append("avatar", {
          name: `${profile.name}'s profile photo`,
          type: "image/jpeg",
          uri: avatar,
        } as any);
      }

      await UserService.updateProfileApi(formData);
      setUpdateProfileError("");

      closeSettings();
      dispatch(setProfileAction({ ...profile, name, email, avatar }));
      dispatch(setToastMessageAction({ message: "Profile updated !", type: "success" }));
    } catch (error: any) {
      setUpdateProfileError(error.message);
    }

    setLoading(false);
  };

  const openPopup = (payload: AlertProps) => {
    const { title, message, buttons } = payload;

    Alert.alert(title, message, buttons);
  };

  const openLogOutPopUp = () => {
    openPopup({
      title: "Log out",
      message: "Are you sure you want to log out ?",
      buttons: [{ text: "Yes", style: "destructive", onPress: () => logOut("yes") }, { text: "No" }],
    });
  };

  const openLogoutFromAllPopUp = () => {
    openPopup({
      title: "Log out",
      message: "Are you sure you want to log out from all devices ?",
      buttons: [{ text: "Yes", style: "destructive", onPress: () => logOut("yes") }, { text: "No" }],
    });
  };

  const openClearHistoryPopUp = () => {
    openPopup({
      title: "Clear history",
      message: "This action will clear all your history",
      buttons: [{ text: "Confirm", style: "destructive", onPress: () => clearHistory() }, { text: "Cancel" }],
    });
  };

  const logOut = async (fromAll: "yes" | "no") => {
    await UserService.logOutApi({ fromAll });
    await AsyncStorage.removeItem("token");
    navigation.pop();
    navigation.navigate("Login");
    dispatch(
      setProfileAction({
        id: "",
        name: "",
        email: "",
        verified: false,
        avatar: "",
        followers: 0,
        followings: 0,
      }),
    );
    dispatch(setLoggedInAction(false));
  };

  const clearHistory = async () => {
    const payload: RemoveHistoryRequest = {
      histories: [],
      all: "yes",
    };

    await HistoryService.removeHistory(payload);
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.innerContainer}>
          <Section
            title="Profile info"
            content={
              <BWForm initialValues={initialValues} validationSchema={updateProfileSchema} onSubmit={(values) => updateProfile(values)}>
                {/* @ts-ignore */}
                {({ setFieldValue, values, dirty }) => {
                  return (
                    <BWView column gap={20}>
                      <BWView row gap={20}>
                        <BWImage src={values.avatar} placeholder={!values.avatar} iconName="user" iconSize={50} style={styles.profileImage} />
                        <BWButton
                          onPress={() => pickImage(setFieldValue)}
                          link
                          title="Edit profile picture"
                          labelStyle={styles.editBtnLabel}
                          iconSource={() => <Feather name="edit-2" size={20} color={COLORS.WARNING[500]} />}
                        />
                      </BWView>
                      <BWInput
                        label="Name"
                        placeholderTextColor={COLORS.WARNING[300]}
                        selectionColor={COLORS.WARNING[500]}
                        placeholder="Name"
                        name="name"
                        enablerError
                        keyboardAppearance="dark"
                        inputStyle={{ color: COLORS.WARNING[500], fontSize: 18, fontFamily: "Minomu" }}
                      />
                      <BWView row justifyContent="space-between" alignItems="center">
                        <BWInput
                          label="Email"
                          placeholder="Email"
                          placeholderTextColor={COLORS.WARNING[300]}
                          selectionColor={COLORS.WARNING[500]}
                          enablerError
                          keyboardAppearance="dark"
                          name="email"
                          style={{ flex: 1 }}
                          inputStyle={{ color: COLORS.WARNING[500], fontSize: 18, fontFamily: "Minomu" }}
                        />
                      </BWView>
                      <BWSubmitButton style={{ width: "100%" }} disabled={!dirty} title="Save" loading={loading} />
                      {updateProfileError && <Text style={{ color: COLORS.DANGER[500], fontSize: 18, fontFamily: "MinomuBold" }}>{updateProfileError}</Text>}
                    </BWView>
                  );
                }}
              </BWForm>
            }
          />
          <BWView column gap={35}>
            <Section
              title="History"
              content={<Action onPress={openClearHistoryPopUp} title="Clear all" icon={<MaterialIcons name="history" size={26} color={COLORS.MUTED[50]} />} />}
            />
            <Section
              title="Sign out"
              content={
                <BWView column gap={25}>
                  <Action
                    onPress={openLogoutFromAllPopUp}
                    title="Logout from all devices"
                    icon={<Feather name="log-out" size={26} color={COLORS.MUTED[50]} />}
                  />
                  <Action onPress={openLogOutPopUp} title="Logout" icon={<Feather name="log-out" size={26} color={COLORS.MUTED[50]} />} />
                </BWView>
              }
            />
          </BWView>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 30,
    paddingHorizontal: 20,
  },

  innerContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 15,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },

  editBtnLabel: {
    fontSize: 16,
    color: COLORS.WARNING[500],
  },

  email: {
    color: COLORS.WARNING[500],
    fontSize: 18,
    fontFamily: "Minomu",
    maxWidth: "55%",
  },
});
