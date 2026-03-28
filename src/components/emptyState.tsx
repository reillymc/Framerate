import type { FC, ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

interface EmptyStateProps {
    heading?: string;
    action?: ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const EmptyState: FC<EmptyStateProps> = ({ heading, action, style }) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={[styles.container, style]}>
            {heading && (
                <Text style={styles.text} variant="body">
                    {heading}
                </Text>
            )}

            {action && <View style={styles.actionContainer}>{action}</View>}
        </View>
    );
};

const createStyles = ({ theme: { color } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flex: 1,
            paddingBottom: 80,
            backgroundColor: color.background,
        },
        text: {
            textAlign: "center",
            fontWeight: "600",
        },
        actionContainer: {
            marginTop: 16,
        },
    });
