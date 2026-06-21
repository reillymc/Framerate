import type { StyleProp, ViewStyle } from "react-native";
import {
    IconAction,
    type IconActionProps,
    withIcon,
} from "@reillymc/react-native-components";

export const HeaderIconAction = withIcon<
    Omit<IconActionProps, "containerStyle"> & {
        containerStyle?: StyleProp<ViewStyle>;
    }
>((props) => {
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
});
