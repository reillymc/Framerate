import "react-native-reanimated";

import { type FC, StrictMode, useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { setOptions } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
    type Theme as RnTheme,
    ThemeProvider as RnThemeProvider,
} from "@react-navigation/native";
import type { DeepPartial } from "@reillymc/es-utils";
import {
    createDefaultStyles,
    DefaultTheme,
    MergeStyles,
    MergeTheme,
    type Theme,
    ThemeProvider,
} from "@reillymc/react-native-components";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { ServiceProvider } from "@/components";
import { useColorScheme } from "@/hooks";
import { SessionProvider } from "@/modules/auth";

import { Dosis } from "../../assets/fonts/fonts.json" with { type: "json" };
import { version } from "../../package.json";

const scaleFont = (size: number, scale: number, appScale: number) => {
    if (appScale < 0.9) {
        return size;
    }

    return Math.round(
        (size / appScale) * (appScale > 1 ? Math.max(1, appScale * scale) : 1),
    );
};

setOptions({
    duration: 250,
    fade: true,
});

let DevToolsBubble: FC<{ queryClient: QueryClient }> | undefined;
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
    // Clear cache when app version is updated (avoid cache causing issues when breaking changes are introduced)
    key: `FRAMERATE-${version}-RQ-CACHE`,
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

    const baseTheme: DeepPartial<Theme> = {
        font: {
            family: {
                mono: Dosis,
                sans: Dosis,
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
        spacing: {
            screenContentTop: Platform.OS === "web" ? 64 : undefined,
            navigationActionHorizontal:
                Platform.OS === "web"
                    ? DefaultTheme.spacing.pageHorizontal
                    : undefined,
            pageHorizontal: 20,
        },
    };

    const lightTheme = MergeTheme(baseTheme, {
        color: {
            primary: "#F99224",
            primaryDark: "#F48815",
            primaryLight: "#F9BA77",
            textOnSecondary: "#F4EDEA",
            textOnPrimary: "#fff",
            border: "#d4cab455",
            shadow: "#000",
            textSecondary: "#BBB",
            inputBackgroundDisabled: "#00000008",
            red: "#d63333",
            green: "#4ed633",
            textHighlight: "#613505",
            background: "#FBF4EF",
            textPrimary: "#23292F",
            secondary: "#727072",
        },
    });

    const darkTheme = MergeTheme(baseTheme, {
        color: {
            textPrimary: "#fff",
            textSecondary: "#737167",
            background: "#000",
            backgroundHighlight: "#20252a",
            foreground: "#111517",
            backgroundOverlay: "#242424",
            border: "#22222280",
            inputBackground: "#141210",
            inputBackgroundDisabled: "#FFFFFF0C",
            inputText: "#fff",
            shadow: "#000",
            secondary: "#908E90",
            secondaryHighlight: "#c1b1a1",
            textOnSecondary: "#12263A",
            textOnPrimary: "#fff",
            primary: "#F69F40",
            primaryDark: "#F48815",
            primaryLight: "#F9BA76",
        },
    });

    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const navigationTheme: RnTheme = {
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
                fontFamily: Dosis,
                fontWeight: "400",
            },
            bold: {
                fontFamily: Dosis,
                fontWeight: "500",
            },
            medium: {
                fontFamily: Dosis,
                fontWeight: "600",
            },
            heavy: {
                fontFamily: Dosis,
                fontWeight: "700",
            },
        },
    };

    if (Platform.OS === "web") {
        // biome-ignore lint/correctness/useHookAtTopLevel: this condition won't change during runtime
        const [loaded] = useFonts({
            dosis: require("../../assets/fonts/Dosis.ttf"),
        });

        if (!loaded) return null;
    }

    const styles = MergeStyles(createDefaultStyles(theme), {
        // highlightedText: { highlightedWeight: { body: Font.SemiBold } },
        menuItem: { paddingVertical: theme.spacing.small },
        text: {
            font: {
                title: {
                    weight: "700",
                },
            },
        },
    });

    return (
        <StrictMode>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister }}
                onSuccess={() => queryClient.resumePausedMutations()}
            >
                <SessionProvider>
                    <ServiceProvider>
                        <RnThemeProvider value={navigationTheme}>
                            <ThemeProvider theme={theme} styles={styles}>
                                <GestureHandlerRootView>
                                    <StatusBar style="auto" animated />
                                    <Slot />
                                </GestureHandlerRootView>
                            </ThemeProvider>
                        </RnThemeProvider>
                    </ServiceProvider>
                </SessionProvider>

                {__DEV__ && DevToolsBubble && (
                    <DevToolsBubble queryClient={queryClient} />
                )}
            </PersistQueryClientProvider>
        </StrictMode>
    );
}
