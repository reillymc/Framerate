import "react-native-reanimated";
import { Font } from "@/assets/fonts";
import { useColorScheme } from "@/hooks";
import { SessionProvider } from "@/modules/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
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
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Slot } from "expo-router";
import { setOptions } from "expo-splash-screen";
import { type FC, useEffect, useMemo } from "react";
import { Platform, StatusBar, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

setOptions({
    duration: 250,
    fade: true,
});

let DevToolsBubble: FC | undefined = undefined;
if (__DEV__) {
    try {
        DevToolsBubble =
            require("react-native-react-query-devtools").DevToolsBubble;
    } catch {
        console.debug("Unable to load React Query dev tools");
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 15,
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
    throttleTime: 3000,
});

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { fontScale } = useWindowDimensions();

    useEffect(() => {
        return NetInfo.addEventListener((state) => {
            const status = !!state.isConnected;
            onlineManager.setOnline(status);
        });
    }, []);

    const baseTheme: DeepPartial<Theme> = useMemo(
        () => ({
            font: {
                familyWeight: {
                    light100: Font.Light,
                    light200: Font.Light,
                    regular400: Font.Regular,
                    bold600: Font.SemiBold,
                    bold800: Font.Bold,
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
        }),
        [fontScale],
    );

    const lightTheme = useMemo(
        () =>
            MergeTheme(baseTheme, {
                color: {
                    primary: "gold",
                    primaryHighlight: "goldenrod",
                    textOnSecondary: "#F4EDEA",
                    textOnPrimary: "#fff",
                    border: "#d5d5d5",
                    shadow: "#000",
                    textSecondary: "#BBB",
                },
            }),
        [baseTheme],
    );

    const darkTheme = useMemo(
        () =>
            MergeTheme(baseTheme, {
                color: {
                    textPrimary: "#fff",
                    textSecondary: "#737167",
                    background: "#000",
                    backgroundHighlight: "#20252a",
                    foreground: "#1a1818",
                    backgroundOverlay: "#242424",
                    border: "#222",
                    inputBackground: "#141210",
                    inputBackgroundDisabled: "#1a1818",
                    inputText: "#fff",
                    shadow: "#000",
                    secondary: "#edd9c5",
                    secondaryHighlight: "#c1b1a1",
                    primaryHighlight: "goldenrod",
                    textOnSecondary: "#12263A",
                    textOnPrimary: "#fff",
                    primaryDisabled: "#ff7e8c",
                    primary: "gold",
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
            fonts: {
                regular: {
                    fontFamily: Font.Regular,
                    fontWeight: "400",
                },
                bold: {
                    fontFamily: Font.Medium,
                    fontWeight: "500",
                },
                medium: {
                    fontFamily: Font.SemiBold,
                    fontWeight: "600",
                },
                heavy: {
                    fontFamily: Font.Bold,
                    fontWeight: "700",
                },
            },
        }),
        [colorScheme, theme],
    );

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
            onSuccess={() => queryClient.resumePausedMutations()}
        >
            <SessionProvider>
                <RnThemeProvider value={navigationTheme}>
                    <ThemeProvider
                        theme={theme}
                        styles={createDefaultStyles(theme)}
                    >
                        <GestureHandlerRootView>
                            <PortalProvider>
                                <StatusBar
                                    barStyle="default"
                                    animated
                                    translucent
                                />
                                <Slot />
                            </PortalProvider>
                        </GestureHandlerRootView>
                    </ThemeProvider>
                </RnThemeProvider>
            </SessionProvider>

            {__DEV__ && DevToolsBubble && <DevToolsBubble />}
        </PersistQueryClientProvider>
    );
}
