import React from "react";
import BWDivider from "components/shared/BWDivider";
import BWView from "components/shared/BWView";
import { Text } from "react-native-ui-lib";
import { COLORS } from "utils/colors";

interface SectionProps {
  title: string;
  content: React.JSX.Element;
}

const Section: React.FC<SectionProps> = ({ title, content }) => {
  return (
    <BWView column gap={20}>
      <Text style={{ color: COLORS.MUTED[50], fontSize: 22, fontFamily: "MinomuBold" }}>
        {title}
      </Text>
      <BWDivider orientation="horizontal" thickness={1} width="100%" color={COLORS.WARNING[500]} />
      {content}
    </BWView>
  );
};

export default Section;
