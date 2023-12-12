import { Dimensions } from "react-native";
import BWView from "components/shared/BWView";
import { Button, Text } from "react-native-ui-lib";
import BWImage from "components/shared/BWImage";
import { COLORS } from "utils/colors";
import { UserProfile } from "types/interfaces/users";
import BWIconButton from "components/shared/BWIconButton";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigatorProps } from "types/interfaces/navigation";

const { width } = Dimensions.get("screen");

interface ProfileInfoProps {
  profile: UserProfile | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const navigation = useNavigation<NavigationProp<StackNavigatorProps>>();

  const openSettings = () => {
    navigation.navigate("Settings", { profile: profile! });
  };

  return (
    <BWView column style={{ width: width, paddingHorizontal: 20 }} gap={30}>
      <BWView justifyContent="space-between" row>
        <BWView alignItems="center" gap={20}>
          <BWImage
            src={profile?.avatar!}
            placeholder={!profile?.avatar}
            iconName="user"
            iconSize={50}
            style={{ width: 80, height: 80, borderRadius: 50 }}
          />
          <BWView column gap={5}>
            <Text style={{ fontFamily: "MinomuBold", color: COLORS.MUTED[50], fontSize: 26 }}>
              {profile!.name}
            </Text>
            <Text style={{ fontFamily: "MinomuBold", color: COLORS.MUTED[700], fontSize: 14 }}>
              {profile!.email}
            </Text>
          </BWView>
        </BWView>
        <BWIconButton
          onPress={openSettings}
          link
          icon={() => <Ionicons name="settings-outline" size={24} color={COLORS.MUTED[50]} />}
        />
      </BWView>
      <BWView row justifyContent="space-between">
        <Text style={{ color: COLORS.MUTED[50], fontSize: 16, fontFamily: "MinomuBold" }}>
          {profile!.followers}{" "}
          <Text style={{ color: COLORS.DARK[300], fontFamily: "Minomu", fontSize: 14 }}>
            Followers
          </Text>
        </Text>
        <Text style={{ color: COLORS.MUTED[50], fontSize: 16, fontFamily: "MinomuBold" }}>
          {profile!.followings}{" "}
          <Text style={{ color: COLORS.DARK[300], fontFamily: "Minomu", fontSize: 14 }}>
            Followings
          </Text>
        </Text>
      </BWView>
    </BWView>
  );
};

export default ProfileInfo;
