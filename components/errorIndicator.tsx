import {
    Icon,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

interface ErrorIndicatorProps {
    error: string | undefined;
}

export const ErrorIndicator: FC<ErrorIndicatorProps> = ({ error }) => {
    const styles = useThemedStyles(createStyles, {});

    if (!error) return null;

    return (
        <View style={styles.errorContainer}>
            <Icon iconName="exclamationcircle" style={styles.errorIcon} />
            <Text variant="bodyEmphasized" style={styles.errorText}>
                {error}
            </Text>
        </View>
    );
};

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        errorContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: padding.small,
        },
        errorText: {
            color: color.red,
        },
        errorIcon: {
            color: color.destructive,
        },
    });
