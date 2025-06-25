import type React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Text } from "@reillymc/react-native-components";

interface EmptyStateProps {
    heading?: string;
    action?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    heading,
    action,
    style,
}) => (
    <View style={[styles.container, style]}>
        {heading && (
            <Text style={styles.text} variant="bodyEmphasized">
                {heading}
            </Text>
        )}

        {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        gap: 16,
        flex: 1,
        marginBottom: 80,
    },
    text: {
        textAlign: "center",
    },
    actionContainer: {
        marginTop: 16,
    },
});
