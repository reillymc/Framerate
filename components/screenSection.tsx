import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SectionHeading } from "./sectionHeading";

interface ScreenSectionProps {
    title: string | undefined;
    onPress?: () => void;
    children?: ReactNode;
}

export const ScreenSection: FC<ScreenSectionProps> = ({
    title,
    onPress,
    children,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <SectionHeading
                title={title}
                onPress={onPress}
                style={styles.sectionHeading}
            />
            {children}
        </>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        sectionHeading: {
            paddingHorizontal: spacing.pageHorizontal,
        },
    });

ScreenSection.displayName = "ScreenSection";
