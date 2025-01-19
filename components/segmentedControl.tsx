import RnSegmentedControl from "@react-native-segmented-control/segmented-control";
import {
    BaseInput,
    type BaseInputProps,
    type ValueItem,
    useTheme,
} from "@reillymc/react-native-components";
import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface SegmentedControlProps<T extends string | number>
    extends Pick<BaseInputProps, "label"> {
    options: ValueItem<T>[];
    value: T;
    style?: StyleProp<ViewStyle>;
    onChange: (e: ValueItem<T>) => void;
}

export const SegmentedControl = <T extends string | number>({
    options,
    value,
    onChange,
    style,
    ...props
}: SegmentedControlProps<T>) => {
    const { theme } = useTheme();

    const selectedIndex = useMemo(
        () => options.findIndex((option) => option.value === value),
        [options, value],
    );

    return (
        <BaseInput
            {...props}
            containerStyle={style}
            inputElement={
                <RnSegmentedControl
                    values={options.map((option) => option.label)}
                    selectedIndex={selectedIndex}
                    fontStyle={{
                        fontFamily: theme.font.familyWeight.regular400,
                        fontWeight: "400",
                        color: theme.color.inputText,
                    }}
                    tintColor={theme.color.background}
                    activeFontStyle={{
                        fontFamily: theme.font.familyWeight.bold800,
                        fontWeight: "600",
                        color: theme.color.inputText,
                    }}
                    style={{
                        borderRadius: theme.border.radius.regular,
                    }}
                    backgroundColor={theme.color.inputBackground}
                    onChange={({ nativeEvent }) =>
                        onChange(options[nativeEvent.selectedSegmentIndex])
                    }
                />
            }
        />
    );
};
