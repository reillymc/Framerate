import { useMemo } from "react";
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
                    fontFamily: theme.font.family.sans,
                    color: styles.inputBase.text.color.enabled as string,
                }}
                tintColor={theme.color.background}
                activeFontStyle={{
                    fontFamily: theme.font.family.sans,
                    fontWeight: "600",
                    color: styles.inputBase.text.color.enabled as string,
                }}
                style={{
                    height: styles.inputBase.container.height.regular,
                }}
                onChange={({ nativeEvent }) => {
                    const value = options[nativeEvent.selectedSegmentIndex];
                    if (value) {
                        onChange(value);
                    }
                }}
            />
        </InputScaffold>
    );
};
