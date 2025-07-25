import type { FC, ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import {
    IconButton,
    IconButtonBase,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useSession } from "@/modules/auth";

import { NAVIGATION_BAR_HEIGHT } from "@/constants/layout";

import { Logo } from "./logo";

interface ScreenLayoutProps {
    meta?: ReactNode;
    tail?: ReactNode;
    isLoading?: boolean;
    isErrored?: boolean;
    isEmpty?: boolean;
    isSearching?: boolean;
    loading?: ReactNode;
    errored?: ReactNode;
    empty?: ReactNode;
    search?: ReactNode;
    options?: { web: { modal: boolean } };
    children: ReactNode;
}

export const ScreenLayout: FC<ScreenLayoutProps> = ({
    meta,
    tail,
    empty,
    errored,
    loading,
    search,
    children,
    isEmpty,
    isErrored,
    isLoading,
    options,
    isSearching,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const router = useRouter();
    const { session } = useSession();

    const segments = useSegments();

    const profileActive = segments.at(-1) === "profile";

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
            {Platform.OS === "web" && !options?.web.modal && (
                <View style={styles.navigationBar}>
                    <Logo
                        withTitle
                        onPress={() => router.navigate("/(app)/(tabs)/movies")}
                    />
                    {session && (
                        <IconButtonBase
                            iconSet={Octicons}
                            iconName="person"
                            onPress={() =>
                                router.push({ pathname: "/profile" })
                            }
                            disabled={profileActive}
                            style={
                                profileActive
                                    ? {
                                          icon: {
                                              color: {
                                                  disabled: theme.color.border,
                                                  enabled: theme.color.primary,
                                                  pressed:
                                                      theme.color.primaryLight,
                                              },
                                          },
                                      }
                                    : undefined
                            }
                        />
                    )}
                </View>
            )}
            {Platform.OS === "web" && options?.web.modal && (
                <>
                    <View style={styles.modalBackdrop} />
                    <View style={styles.modalControlsContainer}>
                        <IconButton
                            iconSet={Octicons}
                            iconName="x-circle"
                            containerStyle={{ margin: 20 }}
                            onPress={router.back}
                        />
                    </View>
                </>
            )}
            {Platform.OS === "web" ? (
                <View style={styles.body}>
                    <View style={styles.main}>{children}</View>
                </View>
            ) : (
                children
            )}
            {tail}
        </>
    );
};

const createStyles = ({ theme: { color, spacing, border } }: ThemedStyles) =>
    StyleSheet.create({
        navigationBar: {
            height: NAVIGATION_BAR_HEIGHT,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.large,
            gap: spacing.medium,
            borderBottomColor: color.border,
            borderBottomWidth: border.width.regular,
            backgroundColor: color.foreground,
        },
        body: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
        },
        main: {
            flex: 1,
        },
        modalBackdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#00000055",
        },
        modalControlsContainer: {
            position: "absolute",
            alignSelf: "center",
            alignItems: "flex-end",
            top: 140,
            zIndex: 1,
            width: 480,
            maxWidth: "90%",
        },
        iconSelected: {
            color: color.primary,
        },
    });
