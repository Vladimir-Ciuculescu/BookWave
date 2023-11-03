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
}

const BWView: ForwardRefRenderFunction<any, PropsWithChildren<BWViewProps>> = (
  { row, column, gap, justifyContent, style, children },
  ref,
) => {
  return (
    <View
      row={row || !column}
      style={[{ gap: gap, justifyContent: justifyContent || "flex-start" }, style]}
    >
      {children}
    </View>
  );
};

export default forwardRef(BWView);
