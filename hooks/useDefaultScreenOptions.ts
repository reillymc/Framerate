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
                fontFamily: theme.font.familyWeight.bold800,
            },
            headerLargeStyle: {
                backgroundColor: theme.color.background,
            },
            headerBackTitleStyle: {
                fontFamily: theme.font.familyWeight.bold800,
                fontSize: theme.font.size.regular,
            },
            headerTintColor: theme.color.secondary,
            headerTitleStyle: {
                fontFamily: theme.font.familyWeight.bold600,
                color: theme.color.textPrimary,
            },
            contentStyle: {
                paddingTop: theme.padding.screenContentTop,
            },
        }),
        [theme],
    );
};
