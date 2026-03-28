import { useMemo } from "react";
import { Platform } from "react-native";
// biome-ignore lint/correctness/noUndeclaredDependencies: type only import via expo router
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
            headerLargeTitleStyle: {
                fontFamily: theme.font.family.sans,
            },
            headerBackTitleStyle: {
                fontFamily: theme.font.family.sans,
                fontWeight: "800",
                fontSize: theme.font.size.regular,
            },
            headerTitleStyle: {
                fontFamily: theme.font.family.sans,
                fontWeight: "800",
            },
            contentStyle: {
                paddingTop:
                    Platform.OS === "web" ? 0 : theme.spacing.screenContentTop,
            },
        }),
        [theme],
    );
};
