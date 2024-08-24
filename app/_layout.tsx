import "react-native-reanimated";
import { fonts } from "@/assets/fonts";
import { useColorScheme, useDefaultScreenOptions } from "@/hooks";
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
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { type FC, useEffect, useMemo } from "react";
import { Platform, StatusBar, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

let DevToolsBubble: FC | undefined = undefined;
if (__DEV__) {
    DevToolsBubble =
        require("react-native-react-query-devtools").DevToolsBubble;
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 15,
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            refetchOnMount: false,
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

    const [loaded] = useFonts(fonts);

    useEffect(() => {
        if (loaded) {
            hideAsync();
        }
    }, [loaded]);

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
                    border: "#d0d0d0",
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
                    border: "#444",
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
        }),
        [colorScheme, theme],
    );

    if (!loaded) {
        return null;
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
            onSuccess={() => queryClient.resumePausedMutations()}
        >
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
            {__DEV__ && DevToolsBubble && <DevToolsBubble />}
        </PersistQueryClientProvider>
    );
}

function RootLayoutNavigator() {
    const screenOptions = useDefaultScreenOptions();

    return (
        <Stack screenOptions={screenOptions} initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ presentation: "modal" }} />
            <Stack.Screen name="credits" options={{ presentation: "modal" }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
    );
}
