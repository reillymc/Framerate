import {
    Icon,
    IconActionV2,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

interface HostActionsProps {
    host: string | null;
    style?: StyleProp<ViewStyle>;
    onSettingsPress?: () => void;
}

export const HostActions: FC<HostActionsProps> = ({
    host,
    style,
    onSettingsPress,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={[styles.settings, style]}>
            <IconActionV2
                iconName="gear"
                variant="flat"
                size="large"
                onPress={onSettingsPress}
            />
            {host && (
                <View style={styles.hostWarningContainer}>
                    <Icon
                        iconName="infocirlce"
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

const createStyles = ({ theme: { color, padding, border } }: ThemedStyles) =>
    StyleSheet.create({
        settings: {
            flex: 1,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            gap: padding.large,
        },
        hostWarningContainer: {
            flexDirection: "row",
            maxWidth: "80%",
            gap: padding.small,
            backgroundColor: color.background,
            borderRadius: border.radius.loose,
            padding: padding.tiny + 2,
        },
        hostWarningIcon: {
            color: color.destructive,
        },
        text: {
            flex: 1,
        },
    });
