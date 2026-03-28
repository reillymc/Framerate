import type { StyleProp, ViewStyle } from "react-native";
import {
    IconAction,
    type IconActionProps,
} from "@reillymc/react-native-components";

export const HeaderIconAction = <G extends string, Fn extends string>(
    props: Omit<IconActionProps<G, Fn>, "containerStyle"> & {
        containerStyle?: StyleProp<ViewStyle>;
    },
) => {
    return (
        <IconAction
            {...props}
            containerStyle={[
                {
                    width: 36,
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                },
                props.containerStyle,
            ]}
        />
    );
};
