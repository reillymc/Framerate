import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        DosisLight: require("../assets/fonts/Dosis-Light.ttf"),
        Dosis: require("../assets/fonts/Dosis-Regular.ttf"),
        DosisBold: require("../assets/fonts/Dosis-Bold.ttf"),
        DosisSemiBold: require("../assets/fonts/Dosis-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" />
            </Stack>
        </ThemeProvider>
    );
}
