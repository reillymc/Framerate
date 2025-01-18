import {
    Icon,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { type FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface StatusIndicatorProps {
    success?: string;
    warning?: string;
    error?: string;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({
    error,
    success,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();

    const { icon, color } = useMemo(() => {
        if (error) {
            return { icon: "x-circle-fill" as const, color: theme.color.red };
        }
        if (success) {
            return {
                icon: "check-circle-fill" as const,
                color: theme.color.green,
            };
        }
        return { icon: "info" as const, color: theme.color.orange };
    }, [error, success, theme.color]);

    if (!(error || success)) return null;

    return (
        <View style={styles.errorContainer}>
            <Icon set="octicons" iconName={icon} style={{ color }} />
            <Text variant="bodyEmphasized" style={{ color }}>
                {error || success}
            </Text>
        </View>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        errorContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: padding.small,
        },
    });
