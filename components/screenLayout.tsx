import { NAVIGATION_BAR_HEIGHT } from "@/constants/layout";
import { useSession } from "@/modules/auth";
import {
    IconAction,
    IconActionV2,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useRouter, useSegments } from "expo-router";
import type { FC, ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
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
                        <IconActionV2
                            iconName="person"
                            onPress={() =>
                                router.push({ pathname: "/profile" })
                            }
                            disabled={profileActive}
                            iconStyle={
                                profileActive ? styles.iconSelected : undefined
                            }
                        />
                    )}
                </View>
            )}
            {Platform.OS === "web" && options?.web.modal && (
                <>
                    <View style={styles.modalBackdrop} />
                    <View style={styles.modalControlsContainer}>
                        <IconAction
                            iconName="closecircle"
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

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        navigationBar: {
            height: NAVIGATION_BAR_HEIGHT,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: padding.large,
            gap: padding.regular,
            borderBottomColor: color.border,
            borderBottomWidth: 2,
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
