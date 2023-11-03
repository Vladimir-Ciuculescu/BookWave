import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Button,
  Icon,
  Modal,
  RadioButton,
  RadioGroup,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import { FontAwesome } from "@expo/vector-icons";
import BWFileSelector from "components/shared/BWFilerSelector";
import BWView from "components/shared/BWView";
import BWInput from "components/shared/BWInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWButton from "components/shared/BWButton";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import "react-native-gesture-handler";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { categories } from "consts/categories";
import { Categories } from "types/enums/categories.enum";
import { DocumentPickerAsset, DocumentPickerResult } from "expo-document-picker";
import BWBottomSheet from "components/shared/BWBottomSheet";
import BWForm from "components/shared/BWForm";
import BWSubmitButton from "components/shared/BWSubmitButton";
import { uploadAudioSchema } from "yup/app.schemas";

const { width, height } = Dimensions.get("window");

export interface UploadFileData {
  title: string;
  category: Categories | "";
  description: string;
  poster?: DocumentPickerAsset;
  audio?: DocumentPickerAsset;
}

const initialValues: UploadFileData = {
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

const UploadScreen: React.FC<any> = () => {
  // ? Hooks
  const [categoryBottomSheet, toggleCategoryBottomSheet] = useState(false);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const closeBottomSheet = () => {
    toggleCategoryBottomSheet(false);
  };

  const selectCategory = (setFieldValue: any, value: string) => {
    setFieldValue("category", value);

    let timeout = setTimeout(() => {
      closeBottomSheet();
      clearInterval(timeout);
    }, 300);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <BWForm
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={uploadAudioSchema}
        >
          {/*@ts-ignore*/}
          {({ values, errors, setFieldValue, touched }) => {
            return (
              <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView style={styles.container}>
                  <BWView column gap={30}>
                    <Text style={styles.title}>Upload new audio</Text>
                    <BWView row gap={30}>
                      <BWFileSelector
                        name="poster"
                        icon={() => (
                          <FontAwesome name="image" size={24} color={COLORS.WARNING[500]} />
                        )}
                        style={styles.fileSelector}
                        options={{ type: "image/*" }}
                      />
                      <BWFileSelector
                        name="audio"
                        icon={() => (
                          <FontAwesome name="file-audio-o" size={24} color={COLORS.WARNING[500]} />
                        )}
                        style={styles.fileSelector}
                        options={{ type: "audio/*" }}
                      />
                    </BWView>

                    {touched.audio && errors.audio && (
                      <Text style={styles.errorMessage}>{errors.audio.uri}</Text>
                    )}
                    <BWInput name="title" label="Title" />

                    <BWButton
                      title="Category"
                      link
                      style={{ width: 140 }}
                      labelStyle={{
                        color: COLORS.MUTED[50],
                        fontSize: 24,
                        fontFamily: "MinomuBold",
                      }}
                      iconSource={() => (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={26}
                          color={COLORS.MUTED[50]}
                        />
                      )}
                      iconOnRight
                      onPress={() => toggleCategoryBottomSheet(true)}
                    />

                    {values.category && <Text style={styles.categoryLabel}>{values.category}</Text>}
                    {touched.category && errors.category && (
                      <Text style={styles.errorMessage}>{errors.category}</Text>
                    )}
                    <BWInput name="description" label="Description" multiline numberOfLines={4} />
                    <BWSubmitButton title="Upload" />
                  </BWView>
                </KeyboardAwareScrollView>
                <BWBottomSheet visible={categoryBottomSheet} onPressOut={closeBottomSheet}>
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
                              selected={category === item}
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

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
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
});
