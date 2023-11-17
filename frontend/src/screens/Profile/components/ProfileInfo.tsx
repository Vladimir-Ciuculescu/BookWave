import { Dimensions } from "react-native";
import BWView from "components/shared/BWView";
import { Text } from "react-native-ui-lib";
import BWImage from "components/shared/BWImage";
import { COLORS } from "utils/colors";

const { width } = Dimensions.get("screen");

const ProfileInfo: React.FC<any> = () => {
  return (
    <BWView column style={{ width: width, paddingHorizontal: 20 }} gap={30}>
      <BWView row alignItems="center" gap={20}>
        <BWImage
          placeholder
          iconName="user"
          iconSize={50}
          style={{ width: 80, height: 80, borderRadius: 50 }}
        />
        <BWView column gap={5}>
          <Text style={{ fontFamily: "MinomuBold", color: COLORS.MUTED[50], fontSize: 26 }}>
            Vladi Ciuculescu
          </Text>
          <Text style={{ fontFamily: "MinomuBold", color: COLORS.MUTED[700], fontSize: 14 }}>
            vladi@gmail.com
          </Text>
        </BWView>
      </BWView>
      <BWView row justifyContent="space-between">
        <Text style={{ color: COLORS.MUTED[50], fontSize: 16, fontFamily: "MinomuBold" }}>
          128{" "}
          <Text style={{ color: COLORS.DARK[300], fontFamily: "Minomu", fontSize: 14 }}>
            Followers
          </Text>
        </Text>
        <Text style={{ color: COLORS.MUTED[50], fontSize: 16, fontFamily: "MinomuBold" }}>
          5024{" "}
          <Text style={{ color: COLORS.DARK[300], fontFamily: "Minomu", fontSize: 14 }}>
            Followings
          </Text>
        </Text>
      </BWView>
    </BWView>
  );
};

export default ProfileInfo;
