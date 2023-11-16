import { StyleSheet } from "react-native";
import { RadioButton, RadioGroup, Text } from "react-native-ui-lib";
import BWView from "./shared/BWView";
import { COLORS } from "utils/colors";
import BWDivider from "./shared/BWDivider";
import BWForm from "./shared/BWForm";
import BWInput from "./shared/BWInput";
import { newPlayListSchema } from "yup/app.schemas";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BWButton from "./shared/BWButton";
import { Visibilites } from "types/enums/visibilites.enum";
import BWSubmitButton from "./shared/BWSubmitButton";
import PlayListService from "api/playlists.api";
import { useDispatch } from "react-redux";
import { setToastMessageAction } from "redux/reducers/toast.reducer";
import { AudioFile } from "types/interfaces/audios";

export interface NewPlayListData {
  title: string;
  visibility: Visibilites | "";
}

const initialValues: NewPlayListData = {
  title: "",
  visibility: "",
};

interface AddPlayListProps {
  onClose: () => void;
  audio: AudioFile | undefined;
}

const radioOptions: Visibilites[] = [Visibilites.public, Visibilites.private];

const AddPlayList: React.FC<AddPlayListProps> = ({ onClose, audio }) => {
  const dispatch = useDispatch();

  const handleVisibility = (
    setFieldValue: (label: string, value: string) => void,
    value: string,
  ) => {
    setFieldValue("visibility", value);
  };

  const handleAddPlaylist = async (values: NewPlayListData) => {
    const { title, visibility } = values;

    const payload = {
      title,
      visibility,
      audioId: audio!.id,
    };

    try {
      await PlayListService.addPlayListApi(payload);
      dispatch(setToastMessageAction({ message: "Playlist added succesfully !", type: "success" }));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BWForm
      onSubmit={(values) => handleAddPlaylist(values)}
      initialValues={initialValues}
      validationSchema={newPlayListSchema}
    >
      {/* @ts-ignore */}
      {({ setFieldValue, errors, touched }) => {
        return (
          <KeyboardAwareScrollView scrollEnabled={false}>
            <BWView column alignItems="center" gap={20} style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, color: COLORS.MUTED[50], fontFamily: "MinomuBold" }}>
                New Playlist
              </Text>
              <BWDivider
                width="100%"
                thickness={2}
                orientation="horizontal"
                color={COLORS.DARK[300]}
              />
              <BWInput
                placeholder="Title"
                style={{ width: "100%" }}
                inputStyle={{ backgroundColor: COLORS.DARK[300] }}
                name="title"
                enablerError
              />
              <BWDivider
                width="100%"
                thickness={2}
                orientation="horizontal"
                color={COLORS.DARK[300]}
              />
              <RadioGroup
                style={styles.radioGroup}
                onValueChange={(value: string) => handleVisibility(setFieldValue, value)}
              >
                {radioOptions.map((option: Visibilites) => (
                  <RadioButton
                    style={styles.radioBtn}
                    labelStyle={styles.radioBtnLabel}
                    color={COLORS.WARNING[500]}
                    value={option}
                    label={option}
                    key={option}
                  />
                ))}
              </RadioGroup>
              {touched.visibility && errors.visibility && (
                <BWView justifyContent="flex-start" style={{ width: "100%" }}>
                  <Text style={styles.errorMessage}>{errors.visibility}</Text>
                </BWView>
              )}
              <BWView row style={{ width: "100%", gap: 10 }} justifyContent="space-between">
                <BWButton
                  onPress={onClose}
                  title="Cancel"
                  style={[styles.optionBtn, styles.cancelBtn]}
                />

                <BWSubmitButton title="Create" style={[styles.optionBtn, styles.saveBtn]} />
              </BWView>
            </BWView>
          </KeyboardAwareScrollView>
        );
      }}
    </BWForm>
  );
};

export default AddPlayList;

const styles = StyleSheet.create({
  optionBtn: {
    flex: 1,
    backgroundColor: COLORS.DARK[300],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    height: 55,
  },
  cancelBtn: {
    backgroundColor: COLORS.DARK[300],
  },
  saveBtn: {
    backgroundColor: COLORS.WARNING[500],
  },

  radioGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    gap: 20,
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
    textAlign: "left",
  },
});
