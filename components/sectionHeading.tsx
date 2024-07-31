import { Icon, Text } from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

interface SectionHeadingProps {
    title: string | undefined;
}

export const SectionHeading: FC<SectionHeadingProps> = ({ title }) => (
    <View style={styles.container}>
        <Text variant="title">{title}</Text>
        <Icon iconName="chevron-right" set="octicons" size={24} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 6,
        alignItems: "baseline",
    },
});

SectionHeading.displayName = "SectionHeading";
