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
                    <Text variant="caption" numberOfLines={1}>
                        Connecting to: {host}
                    </Text>
                </View>
            )}
        </View>
    );
};

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
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
            maxWidth: "70%",
            gap: padding.small,
        },
        hostWarningIcon: {
            color: color.destructive,
        },
    });
