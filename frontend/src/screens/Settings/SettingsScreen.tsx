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
import { Alert, AlertButton, AlertOptions, Keyboard, TouchableWithoutFeedback, View } from "react-native";
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
  };

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <BWIconButton link onPress={closeSettings} icon={() => <AntDesign name="close" size={24} color={COLORS.MUTED[50]} />} />,
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
    const { name, avatar } = values;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("avatar", {
        name: `${profile.name}'s profile photo`,
        type: "image/jpeg",
        uri: avatar,
      } as any);

      await UserService.updateProfileApi(formData);

      closeSettings();
      dispatch(setProfileAction({ ...profile, name, avatar }));
      dispatch(setToastMessageAction({ message: "Profile updated !", type: "success" }));
    } catch (error) {
      dispatch(
        setToastMessageAction({
          message: "Something went wrong, please try again !",
          type: "error",
        }),
      );
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
      <View style={{ flex: 1, flexDirection: "column", paddingTop: 30, paddingHorizontal: 20 }}>
        <View style={{ flex: 1, flexDirection: "column", gap: 15 }}>
          <Section
            title="Profile info"
            content={
              <BWForm initialValues={initialValues} validationSchema={updateProfileSchema} onSubmit={(values) => updateProfile(values)}>
                {/* @ts-ignore */}
                {({ setFieldValue, values, dirty }) => {
                  return (
                    <BWView column gap={20}>
                      <BWView row gap={20}>
                        <BWImage
                          src={values.avatar}
                          placeholder={!values.avatar}
                          iconName="user"
                          iconSize={50}
                          style={{ width: 80, height: 80, borderRadius: 50 }}
                        />

                        <BWButton
                          onPress={() => pickImage(setFieldValue)}
                          link
                          title="Edit profile picture"
                          labelStyle={{ fontSize: 14, color: COLORS.MUTED[50] }}
                          iconSource={() => <Feather name="edit-2" size={20} color={COLORS.MUTED[50]} />}
                        />
                      </BWView>

                      <BWInput placeholder="Edit your name" name="name" enablerError keyboardAppearance="dark" />
                      <BWView row justifyContent="space-between" alignItems="center">
                        <Text style={{ color: COLORS.WARNING[500], fontSize: 18, fontFamily: "Minomu" }}>{profile.email}</Text>
                        <BWSubmitButton disabled={!dirty} title="Save" loading={loading} />
                      </BWView>
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
                    icon={<MaterialIcons name="history" size={26} color={COLORS.MUTED[50]} />}
                  />
                  <Action onPress={openLogOutPopUp} title="Logout" icon={<MaterialIcons name="history" size={26} color={COLORS.MUTED[50]} />} />
                </BWView>
              }
            />
          </BWView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingsScreen;
