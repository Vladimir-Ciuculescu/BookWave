import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AudioService from "api/audios.api";
import BWBottomSheet from "components/shared/BWBottomSheet";
import BWButton from "components/shared/BWButton";
import BWFileSelector from "components/shared/BWFilerSelector";
import BWForm from "components/shared/BWForm";
import BWIconButton from "components/shared/BWIconButton";
import BWInput from "components/shared/BWInput";
import BWSubmitButton from "components/shared/BWSubmitButton";
import BWView from "components/shared/BWView";
import { categories } from "consts/categories";
import { TAB_BAR_HEIGHT } from "consts/dimensions";
import { DocumentPickerAsset } from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AnimatedImage, Chip, RadioButton, RadioGroup, Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { Category } from "types/enums/categories.enum";
import { COLORS } from "utils/colors";
import { uploadAudioSchema } from "yup/app.schemas";

const { width, height } = Dimensions.get("window");

export interface UploadAudioData {
  title: string;
  category: Category | "";
  description: string;
  poster?: DocumentPickerAsset;
  audio?: DocumentPickerAsset;
}

const initialValues: UploadAudioData = {
  title: "",
  description: "",
  category: "",
  audio: {
    name: "",
    uri: "",
    size: undefined,
    mimeType: undefined,
  },
};

const UploadAudioScreen: React.FC<any> = () => {
  // ? Hooks
  const [categoryBottomSheet, toggleCategoryBottomSheet] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const closeBottomSheet = () => {
    toggleCategoryBottomSheet(false);
  };

  const selectCategory = (setFieldValue: any, value: string) => {
    setFieldValue("category", value);

    let timeout = setTimeout(() => {
      closeBottomSheet();
      clearInterval(timeout);
    }, 500);
  };

  const removePoster = (setFieldValue: (label: string, value: any) => void) => {
    setFieldValue("poster", undefined);
  };

  const removeAudio = (setFieldValue: (label: string, value: any) => void) => {
    setFieldValue("audio", { name: "", uri: "", size: undefined, mimeType: undefined });
  };

  const handleUploadAudio = async (values: UploadAudioData, resetForm: () => void) => {
    const { title, category, description, audio, poster } = values;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("about", description);

      formData.append("audio", {
        name: audio!.name,
        type: audio?.mimeType,
        uri: audio?.uri,
      } as any);

      formData.append("poster", {
        name: poster?.name,
        type: poster?.mimeType,
        uri: poster?.uri,
      } as any);

      await AudioService.uploadAudioApi(formData);

      dispatch(setToastMessageAction({ message: "Audio file succesfully uploaded", type: "success" }));

      resetForm();
    } catch (error: any) {
      dispatch(
        setToastMessageAction({
          message: error.message,
          type: "error",
        }),
      );
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />

        <BWForm initialValues={initialValues} onSubmit={(values, { resetForm }) => handleUploadAudio(values, resetForm)} validationSchema={uploadAudioSchema}>
          {/* @ts-ignore */}
          {({ values, errors, setFieldValue, touched }) => {
            return (
              <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} style={styles.container}>
                  <BWView column gap={30}>
                    <Text style={styles.title}>Upload new audio</Text>
                    <BWView row gap={30}>
                      <BWFileSelector
                        label="Select a poster"
                        name="poster"
                        icon={() => <FontAwesome name="image" size={24} color={COLORS.WARNING[500]} />}
                        style={styles.fileSelector}
                        options={{ type: "image/*" }}
                      />
                      <BWFileSelector
                        label="Select an audio"
                        name="audio"
                        icon={() => <FontAwesome name="file-audio-o" size={24} color={COLORS.WARNING[500]} />}
                        style={styles.fileSelector}
                        options={{ type: "audio/*" }}
                      />
                    </BWView>

                    {values.poster && (
                      <View style={styles.posterContainer}>
                        <BWIconButton
                          onPress={() => removePoster(setFieldValue)}
                          style={styles.removePosterBtn}
                          icon={() => <AntDesign name="close" size={20} color={COLORS.MUTED[50]} />}
                        />
                        <AnimatedImage source={{ uri: values.poster.uri }} style={styles.poster} />
                      </View>
                    )}

                    {values.audio.name && (
                      <BWView row>
                        <Chip
                          borderRadius={22}
                          label={values.audio.name}
                          leftElement={<Ionicons name="ios-musical-notes" size={24} color="black" />}
                          rightElement={
                            <BWIconButton
                              onPress={() => removeAudio(setFieldValue)}
                              style={{ backgroundColor: "transparent" }}
                              icon={() => <AntDesign name="close" size={20} color={COLORS.DARK[50]} />}
                            />
                          }
                          labelStyle={styles.audioChipLabel}
                          containerStyle={styles.audioChipContainer}
                        />
                      </BWView>
                    )}

                    {touched.audio && errors.audio && <Text style={styles.errorMessage}>{errors.audio.uri}</Text>}

                    <BWInput keyboardAppearance="dark" enablerError name="title" label="Title" />

                    <BWButton
                      title="Category"
                      link
                      style={styles.categoryBtn}
                      labelStyle={{
                        color: COLORS.MUTED[50],
                        fontSize: 24,
                        fontFamily: "MinomuBold",
                      }}
                      iconSource={() => <MaterialIcons name="keyboard-arrow-down" size={26} color={COLORS.MUTED[50]} />}
                      iconOnRight
                      onPress={() => toggleCategoryBottomSheet(true)}
                    />

                    {values.category && <Text style={styles.categoryLabel}>{values.category}</Text>}
                    {touched.category && errors.category && <Text style={styles.errorMessage}>{errors.category}</Text>}
                    <BWInput keyboardAppearance="dark" enablerError name="description" label="Description" multiline numberOfLines={4} />
                    <BWSubmitButton title="Upload" loading={loading} full />
                  </BWView>
                </KeyboardAwareScrollView>
                <BWBottomSheet visible={categoryBottomSheet} onPressOut={closeBottomSheet} height="60%">
                  <Text style={styles.bottomSheetTitle}>Choose a category</Text>
                  <View style={styles.bottomSheetContainer}>
                    <View style={{ height: "80%", width: "100%" }}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <RadioGroup
                          initialValue={values.category}
                          style={styles.radioGroup}
                          onValueChange={(value: string) => selectCategory(setFieldValue, value)}
                        >
                          {categories.map((item, index) => (
                            <RadioButton
                              style={styles.radioBtn}
                              labelStyle={styles.radioBtnLabel}
                              iconStyle={{ tintColor: "red" }}
                              key={index}
                              value={item}
                              label={item}
                              color={COLORS.WARNING[500]}
                              selected={values.category === item}
                            />
                          ))}
                        </RadioGroup>
                      </ScrollView>
                    </View>
                  </View>
                </BWBottomSheet>
              </View>
            );
          }}
        </BWForm>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default UploadAudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  scrollContainer: {
    paddingBottom: TAB_BAR_HEIGHT + 30,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "MinomuBold",
    color: COLORS.MUTED[50],
    fontSize: 30,
  },

  fileSelectorsContainer: {
    display: "flex",
  },

  posterContainer: {
    width: "100%",
    height: 200,
  },

  poster: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },

  removePosterBtn: {
    position: "absolute",
    zIndex: 1,
    right: 5,
    top: 5,
    backgroundColor: COLORS.MUTED[900],
    width: 30,
    height: 30,
    borderRadius: 0,
  },

  removeAudioBtn: {
    backgroundColor: "transparent",
  },

  audioChipLabel: {
    color: COLORS.MUTED[50],
    fontSize: 14,
    fontFamily: "Minomu",
    marginHorizontal: 10,
  },

  audioChipContainer: {
    backgroundColor: COLORS.WARNING[500],
    paddingHorizontal: 10,
    height: 40,
  },

  categoryBtn: {
    width: 140,
  },

  fileSelector: {
    width: 85,
    height: 85,
    borderRadius: 5,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.WARNING[500],
  },

  categoryLabel: {
    fontSize: 20,
    fontFamily: "MinomuBold",
    color: COLORS.WARNING[500],
  },

  bottomComponent: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "lightgray",
    padding: 16,
    height: 100,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  sheet: {
    backgroundColor: COLORS.DARK[200],
    padding: 32,
    height: height / 1.5,
    width: width,
    position: "absolute",
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },

  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.MUTED[50],
  },

  bottomSheetContainer: {
    flex: 1,
    paddingTop: 20,
  },

  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },

  radioBtn: {
    borderColor: COLORS.WARNING[500],
  },

  radioBtnLabel: {
    color: COLORS.MUTED[50],
    fontSize: 16,
    fontFamily: "Minomu",
  },

  errorMessage: {
    color: COLORS.DANGER[500],
    fontFamily: "Minomu",
  },

  //test
});
