import { NAVIGATION_BAR_HEIGHT } from "@/constants/layout";
import {
    Action,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { router } from "expo-router";
import type { FC, ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Logo } from "./logo";

interface ScreenLayoutProps {
    meta?: ReactNode;
    isLoading?: boolean;
    isErrored?: boolean;
    isEmpty?: boolean;
    isSearching?: boolean;
    loading?: ReactNode;
    errored?: ReactNode;
    empty?: ReactNode;
    search?: ReactNode;
    children: ReactNode;
}

export const ScreenLayout: FC<ScreenLayoutProps> = ({
    meta,
    empty,
    errored,
    loading,
    search,
    children,
    isEmpty,
    isErrored,
    isLoading,
    isSearching,
}) => {
    const styles = useThemedStyles(createStyles, {});

    if (isLoading) {
        return (
            <>
                {meta}
                {loading}
            </>
        );
    }

    if (isErrored) {
        return (
            <>
                {meta}
                {errored}
            </>
        );
    }

    if (isEmpty) {
        return (
            <>
                {meta}
                {empty}
            </>
        );
    }

    if (isSearching) {
        return (
            <>
                {meta}
                {search}
            </>
        );
    }

    return (
        <>
            {meta}
            {Platform.OS === "web" ? (
                <View style={styles.navigationBar}>
                    <Logo />
                    <Pressable
                        onPress={() => router.navigate("/(app)/(tabs)/movies")}
                    >
                        <Text variant="display">Framerate</Text>
                    </Pressable>
                    <Action />
                </View>
            ) : null}
            {Platform.OS === "web" ? (
                <View style={styles.body}>
                    <View style={styles.outerColumns} />
                    <View style={styles.main}>{children}</View>
                    <View style={styles.outerColumns} />
                </View>
            ) : (
                children
            )}
        </>
    );
};

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        navigationBar: {
            height: NAVIGATION_BAR_HEIGHT,
            alignItems: "center",
            paddingLeft: padding.large,
            flexDirection: "row",
            gap: padding.regular,
            borderBottomColor: color.border,
            borderBottomWidth: 2,
            backgroundColor: color.foreground,
        },
        body: {
            flexDirection: "row",
            flex: 1,
        },
        outerColumns: {
            flex: 1,
        },
        main: {
            flex: 2,
            maxWidth: 400,
        },
    });
