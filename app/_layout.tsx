import { useColorScheme, useDefaultScreenOptions } from "@/hooks";
import {
    type Theme as RnTheme,
    ThemeProvider as RnThemeProvider,
} from "@react-navigation/native";
import {
    type DeepPartial,
    DefaultTheme,
    MergeTheme,
    PortalProvider,
    type Theme,
    ThemeProvider,
    createDefaultStyles,
    scaleFont,
} from "@reillymc/react-native-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { Platform, StatusBar, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevToolsBubble } from "react-native-react-query-devtools";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { fontScale } = useWindowDimensions();

    const [loaded] = useFonts({
        dosisLight: require("../assets/fonts/Dosis-Light.ttf"),
        dosis: require("../assets/fonts/Dosis-Regular.ttf"),
        dosisBold: require("../assets/fonts/Dosis-Bold.ttf"),
        dosisSemiBold: require("../assets/fonts/Dosis-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            hideAsync();
        }
    }, [loaded]);

    const baseTheme: DeepPartial<Theme> = useMemo(
        () => ({
            font: {
                familyWeight: {
                    light100: "dosisLight",
                    light200: "dosisLight",
                    regular400: "dosis",
                    bold600: "dosisSemiBold",
                    bold800: "dosisBold",
                },
                size: {
                    tiny: scaleFont(14, 0.9, fontScale),
                    small: scaleFont(16, 0.88, fontScale),
                    regular: scaleFont(20, 0.86, fontScale),
                    emphasised: scaleFont(22, 0.84, fontScale),
                    large: scaleFont(24, 0.84, fontScale),
                    xLarge: scaleFont(28, 0.82, fontScale),
                    xxLarge: scaleFont(36, 0.8, fontScale),
                },
            },
            padding: {
                screenContentTop: Platform.OS === "web" ? 64 : undefined,
                navigationActionHorizontal:
                    Platform.OS === "web"
                        ? DefaultTheme.padding.pageHorizontal
                        : undefined,
                pageHorizontal: 20,
            },
            color: {
                border: "#d0d0d0",
                primary: "gold",
            },
        }),
        [fontScale],
    );

    const lightTheme = useMemo(
        () =>
            MergeTheme(baseTheme, {
                color: {
                    primary: "#ff465a",
                    primaryHighlight: "#ff6d7d",
                    textOnSecondary: "#F4EDEA",
                    textOnPrimary: "#fff",
                },
            }),
        [baseTheme],
    );

    const darkTheme = useMemo(
        () =>
            MergeTheme(baseTheme, {
                color: {
                    textPrimary: "#fff",
                    textSecondary: "#999",
                    background: "#000",
                    backgroundHighlight: "#20252a",
                    foreground: "#1a1818",
                    backgroundOverlay: "#242424",
                    border: "#20252a",
                    inputBackground: "#141210",
                    inputBackgroundDisabled: "#1a1818",
                    inputText: "#fff",
                    shadow: "#000",
                    secondary: "#edd9c5",
                    secondaryHighlight: "#c1b1a1",
                    textOnSecondary: "#12263A",
                    textOnPrimary: "#fff",
                    primaryDisabled: "#ff7e8c",
                },
            }),
        [baseTheme],
    );

    const theme = useMemo(
        () => (colorScheme === "dark" ? darkTheme : lightTheme),
        [colorScheme, darkTheme, lightTheme],
    );

    const navigationTheme: RnTheme = useMemo(
        () => ({
            dark: colorScheme === "dark",
            colors: {
                background: theme.color.background,
                border: theme.color.border,
                card: theme.color.foreground,
                notification: theme.color.primary,
                primary: theme.color.textPrimary,
                text: theme.color.textPrimary,
            },
        }),
        [colorScheme, theme],
    );

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <RnThemeProvider value={navigationTheme}>
                <ThemeProvider
                    theme={theme}
                    styles={createDefaultStyles(theme)}
                >
                    <GestureHandlerRootView>
                        <PortalProvider>
                            <StatusBar
                                barStyle="default"
                                animated={true}
                                translucent={true}
                            />
                            <RootLayoutNavigator />
                        </PortalProvider>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </RnThemeProvider>
            <DevToolsBubble />
        </QueryClientProvider>
    );
}

function RootLayoutNavigator() {
    const screenOptions = useDefaultScreenOptions();

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="index" />
            <Stack.Screen name="review" />
            <Stack.Screen
                name="editReview"
                options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen name="search" options={{ presentation: "modal" }} />
            <Stack.Screen name="movie" />
            <Stack.Screen name="watchlist" />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
    );
}
