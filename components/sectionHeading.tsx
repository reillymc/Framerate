import type { FC } from "react";
import {
    Pressable,
    type StyleProp,
    StyleSheet,
    type ViewStyle,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { Icon, Text, useTheme } from "@reillymc/react-native-components";

interface SectionHeadingProps {
    title: string | undefined;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const SectionHeading: FC<SectionHeadingProps> = ({
    title,
    onPress,
    style,
}) => {
    const { theme } = useTheme();
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && { opacity: 0.5 },
                style,
            ]}
            onPress={onPress}
        >
            <Text variant="title">{title}</Text>
            {onPress && (
                <Icon
                    iconSet={Octicons}
                    iconName="chevron-right"
                    size="large"
                    style={{ color: theme.color.textSecondary }}
                />
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-end",
        paddingVertical: 8,
    },
});

SectionHeading.displayName = "SectionHeading";
