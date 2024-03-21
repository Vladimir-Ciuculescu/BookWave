import { AntDesign } from "@expo/vector-icons";
import BWDivider from "components/shared/BWDivider";
import BWImage from "components/shared/BWImage";
import BWView from "components/shared/BWView";
import { StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { AudioFile } from "types/interfaces/audios";
import { COLORS } from "utils/colors";

interface HistoryItemProps {
  date: Date;
  audios: AudioFile[];
}

const HistoryItem: React.FC<HistoryItemProps> = ({ date, audios }) => {
  return (
    <BWView column gap={20}>
      <Text style={styles.date}>{date.toString()}</Text>
      <BWDivider orientation="horizontal" thickness={1} width="100%" color={COLORS.WARNING[500]} />
      {audios.map((audio: any) => {
        return (
          <BWView key={audio.audioId} row alignItems="center" justifyContent="space-between">
            <BWView row alignItems="center" gap={15}>
              <BWImage style={styles.audioImage} placeholder={!audio.poster} iconName="image" src={audio.poster!} />

              <Text style={styles.audioTitle} numberOfLines={1} ellipsizeMode="tail">
                {audio.title}
              </Text>
            </BWView>
            <AntDesign name="close" size={26} color={COLORS.MUTED[50]} />
          </BWView>
        );
      })}
    </BWView>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  date: {
    color: COLORS.MUTED[50],
    fontSize: 22,
    fontFamily: "MinomuBold",
  },
  audioImage: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  audioTitle: {
    color: COLORS.MUTED[50],
    fontSize: 18,
    fontFamily: "Minomu",
    maxWidth: "70%",
  },
});
