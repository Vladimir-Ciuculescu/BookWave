import { ReactNode, forwardRef, ForwardRefRenderFunction, PropsWithChildren } from "react";
import { ViewStyle } from "react-native";
import { View } from "react-native-ui-lib";

interface BWViewProps {
  children: ReactNode;
  row?: boolean;
  column?: boolean;
  gap?: ViewStyle["gap"];
  style?: ViewStyle;
  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
}

const BWView: ForwardRefRenderFunction<any, PropsWithChildren<BWViewProps>> = (
  { row, column, gap, justifyContent, style, children, alignItems },
  ref,
) => {
  return (
    <View
      row={row || !column}
      style={[
        {
          gap: gap,
          justifyContent: justifyContent || "flex-start",
          alignItems: alignItems || "stretch",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default forwardRef(BWView);
