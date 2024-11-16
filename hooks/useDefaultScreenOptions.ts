import { useMemo } from "react";

// biome-ignore lint/style/useImportType: transitive dependency
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "@reillymc/react-native-components";

export const useDefaultScreenOptions = (): NativeStackNavigationOptions => {
    const { theme } = useTheme();

    return useMemo(
        () => ({
            headerLargeTitleShadowVisible: false,
            headerLargeTitle: true,
            headerTransparent: true,
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
                paddingTop: theme.padding.screenContentTop,
            },
        }),
        [theme],
    );
};
