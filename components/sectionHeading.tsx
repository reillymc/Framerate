import { Icon, Text } from "@reillymc/react-native-components";
import type { FC } from "react";
import {
    Pressable,
    type StyleProp,
    StyleSheet,
    type ViewStyle,
} from "react-native";

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
    <Pressable style={[styles.container, style]} onPress={onPress}>
        <Text variant="title">{title}</Text>
        {onPress && <Icon iconName="chevron-right" set="octicons" size={24} />}
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 6,
        alignItems: "baseline",
    },
});

SectionHeading.displayName = "SectionHeading";
