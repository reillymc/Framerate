import { useMemo } from "react";
import { Platform } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "@reillymc/react-native-components";

export const useDefaultScreenOptions = (): NativeStackNavigationOptions => {
    const { theme } = useTheme();

    return useMemo(
        () => ({
            headerLargeTitleShadowVisible: false,
            headerLargeTitle: true,
            headerTransparent: Platform.OS !== "android",
            headerShown: Platform.OS !== "web",
            headerBlurEffect: "regular",
            headerLargeTitleStyle: {
                color: theme.color.textPrimary,
            },
            headerLargeStyle: {
                backgroundColor: theme.color.background,
            },
            headerBackTitleStyle: {
                fontSize: theme.font.size.small,
            },
            headerTintColor: theme.color.secondary,
            headerTitleStyle: {
                fontWeight: "600",
                color: theme.color.textPrimary,
            },
            contentStyle: {
                paddingTop:
                    Platform.OS === "web" ? 0 : theme.spacing.screenContentTop,
            },
        }),
        [theme],
    );
};
