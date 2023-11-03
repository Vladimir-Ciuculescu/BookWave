import { ViewStyle, View, StyleSheet } from "react-native";
import BWIconButton from "./BWIconButton";
import { Text } from "react-native-ui-lib";
import { COLORS } from "utils/colors";
import * as DocumentPicker from "expo-document-picker";
import { useFormikContext } from "formik";

interface BWFileSelectorProps {
  name: string;
  icon: any;
  style?: ViewStyle;
  onPress?: () => void;
  options: DocumentPicker.DocumentPickerOptions;
}

const BWFileSelector: React.FC<BWFileSelectorProps> = ({ icon, onPress, style, options, name }) => {
  const { setFieldValue } = useFormikContext();

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync(options);

      if (result.assets) {
        const [file] = result.assets;

        setFieldValue(name, file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <BWIconButton style={style} icon={icon} onPress={pickFile} />
      <Text style={{ color: COLORS.MUTED[50] }}>Select a file</Text>
    </View>
  );
};

export default BWFileSelector;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
