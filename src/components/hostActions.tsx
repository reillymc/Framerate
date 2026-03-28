import type { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import {
    Icon,
    IconButton,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

interface HostActionsProps {
    host: string | null;
    onSettingsPress?: () => void;
}

export const HostActions: FC<HostActionsProps> = ({
    host,
    onSettingsPress,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={styles.settings}>
            <IconButton
                iconSet={Octicons}
                iconName="gear"
                onPress={onSettingsPress}
            />
            {host && (
                <View style={styles.hostWarningContainer}>
                    <Icon
                        iconSet={AntDesign}
                        iconName="exclamation-circle"
                        style={styles.hostWarningIcon}
                    />
                    <Text
                        variant="caption"
                        numberOfLines={1}
                        style={styles.text}
                    >
                        Connecting to: {host}
                    </Text>
                </View>
            )}
        </View>
    );
};

const createStyles = ({ theme: { color, spacing, border } }: ThemedStyles) =>
    StyleSheet.create({
        settings: {
            flex: 1,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.large,
            position: "absolute",
            bottom: Platform.OS === "web" ? 32 : 48,
            right: Platform.OS === "web" ? 32 : 48,
            left: Platform.OS === "web" ? 32 : 48,
        },
        hostWarningContainer: {
            flexDirection: "row",
            maxWidth: "80%",
            gap: spacing.small,
            backgroundColor: color.background,
            borderRadius: border.radius.loose,
            padding: spacing.tiny + 2,
        },
        hostWarningIcon: {
            color: color.warning,
        },
        text: {
            flex: 1,
        },
    });
