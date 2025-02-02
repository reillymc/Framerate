import { Redirect, Stack } from "expo-router";
import type React from "react";

import { useDefaultScreenOptions } from "@/hooks";
import { useSession } from "@/modules/auth";
import { Platform } from "react-native";

// biome-ignore lint/style/useNamingConvention: expo unstable naming
export const unstable_settings = {
    initialRouteName: "index",
};

const AuthenticationStack: React.FC = () => {
    const screenOptions = useDefaultScreenOptions();
    const { session, userId, isLoading, isSigningIn } = useSession();

    if (isLoading) {
        return null;
    }

    if (session && userId && !isSigningIn) {
        return <Redirect href="/(app)/(tabs)/movies" />;
    }

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="register"
                options={{
                    presentation: Platform.OS === "ios" ? "formSheet" : "modal",
                }}
            />
            <Stack.Screen
                name="server"
                options={{
                    headerLargeTitle: false,
                    presentation:
                        Platform.OS === "web"
                            ? "transparentModal"
                            : "formSheet",
                    sheetAllowedDetents: [0.26], // TODO: move to fitToContents when option no longer causes modal to take up whole screen
                }}
            />
        </Stack>
    );
};

export default AuthenticationStack;
