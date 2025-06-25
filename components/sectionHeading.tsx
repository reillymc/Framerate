import type { FC } from "react";
import {
    Pressable,
    type StyleProp,
    StyleSheet,
    type ViewStyle,
} from "react-native";
import { Icon, Text } from "@reillymc/react-native-components";

interface SectionHeadingProps {
    title: string | undefined;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const SectionHeading: FC<SectionHeadingProps> = ({
    title,
    onPress,
    style,
}) => (
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
                iconName="chevron-right"
                set="octicons"
                size={24}
                style={{ paddingTop: 2 }}
                color="gray"
            />
        )}
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        paddingVertical: 8,
    },
});

SectionHeading.displayName = "SectionHeading";
