import type { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { type Href, Link } from "expo-router";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { SectionHeading } from "./sectionHeading";

interface ScreenSectionProps {
    title: string | undefined;
    href: Href;
    children?: ReactNode;
}

export const ScreenSection: FC<ScreenSectionProps> = ({
    title,
    href,
    children,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Link href={href} asChild>
                <SectionHeading title={title} style={styles.sectionHeading} />
            </Link>
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
