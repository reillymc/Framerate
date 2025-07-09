import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import RnSegmentedControl from "@react-native-segmented-control/segmented-control";
import {
    InputScaffold,
    type InputScaffoldProps,
    useTheme,
    type ValueItem,
} from "@reillymc/react-native-components";

interface SegmentedControlProps<T extends string | number>
    extends Pick<InputScaffoldProps, "label" | "containerStyle"> {
    options: ValueItem<T>[];
    value: T;
    onChange: (e: ValueItem<T>) => void;
}

export const SegmentedControl = <T extends string | number>({
    options,
    value,
    onChange,
    ...props
}: SegmentedControlProps<T>) => {
    const { theme, styles } = useTheme();

    const selectedIndex = useMemo(
        () => options.findIndex((option) => option.value === value),
        [options, value],
    );

    return (
        <InputScaffold {...props}>
            <RnSegmentedControl
                values={options.map((option) => option.label)}
                selectedIndex={selectedIndex}
                fontStyle={{
                    fontFamily: styles.inputBase.text.fontFamilyWeight,
                    color: styles.inputBase.text.color.enabled as string,
                }}
                tintColor={theme.color.background}
                activeFontStyle={{
                    fontFamily: styles.highlightedText.highlighted.body,
                    color: styles.inputBase.text.color.enabled as string,
                }}
                style={{
                    borderRadius: styles.inputBase.container.borderRadius,
                    height: styles.inputBase.container.height,
                }}
                backgroundColor={
                    styles.inputBase.container.backgroundColor.enabled as string
                }
                onChange={({ nativeEvent }) =>
                    onChange(options[nativeEvent.selectedSegmentIndex])
                }
            />
        </InputScaffold>
    );
};
