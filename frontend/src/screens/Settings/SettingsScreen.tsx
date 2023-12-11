import { useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BWIconButton from "components/shared/BWIconButton";
import { Text, TextField } from "react-native-ui-lib";
import { StackNavigatorProps } from "types/interfaces/navigation";
import { AntDesign, Feather } from "@expo/vector-icons";
import { COLORS } from "utils/colors";
import BWView from "components/shared/BWView";
import BWDivider from "components/shared/BWDivider";
import BWImage from "components/shared/BWImage";
import BWButton from "components/shared/BWButton";
import { RouteProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import BWForm from "components/shared/BWForm";
import { updateProfileSchema } from "yup/app.schemas";
import BWInput from "components/shared/BWInput";

interface ProfileData {
  name: string;
  avatar?: string;
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BWIconButton
          link
          onPress={closeSettings}
          icon={() => <AntDesign name="close" size={24} color={COLORS.MUTED[50]} />}
        />
      ),
    });
  }, [navigation]);

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

  const handleUpdate = () => {};

  const closeSettings = () => {
    navigation.goBack();
  };

  return (
    <BWView column style={{ flex: 1, paddingTop: 30, paddingHorizontal: 20 }}>
      <BWView column gap={15}>
        <Text style={{ color: COLORS.MUTED[50], fontSize: 22, fontFamily: "MinomuBold" }}>
          Profile Section
        </Text>
        <BWDivider
          orientation="horizontal"
          thickness={1}
          width="100%"
          color={COLORS.WARNING[500]}
        />
        <BWForm
          initialValues={initialValues}
          validationSchema={updateProfileSchema}
          onSubmit={handleUpdate}
        >
          {/* @ts-ignore */}
          {({ setFieldValue, values }) => {
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
                    // onPress={pickImage}
                    link
                    title="Edit profile picture"
                    labelStyle={{ fontSize: 14, color: COLORS.MUTED[50] }}
                    iconSource={() => <Feather name="edit-2" size={20} color={COLORS.MUTED[50]} />}
                  />
                </BWView>
                {/* <TextField
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: COLORS.MUTED[900],
              height: 50,
              borderRadius: 20,
              padding: 20,
              color: COLORS.MUTED[50],
            }}
            selectionColor={COLORS.MUTED[50]}
          /> */}
                <BWInput placeholder="Edit your name" name="name" enablerError />
                <BWView row justifyContent="space-between">
                  <Text style={{ color: COLORS.WARNING[500], fontSize: 18, fontFamily: "Minomu" }}>
                    {profile.email}
                  </Text>
                  <Text>awd</Text>
                </BWView>
              </BWView>
            );
          }}
        </BWForm>
      </BWView>
    </BWView>
  );
};

export default SettingsScreen;
