import { Redirect, Stack } from "expo-router";
import type React from "react";

import { useDefaultScreenOptions } from "@/hooks";
import { useSession } from "@/modules/auth";

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
                options={{ presentation: "formSheet" }}
            />
            <Stack.Screen
                name="server"
                options={{
                    headerLargeTitle: false,
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.2],
                }}
            />
        </Stack>
    );
};

export default AuthenticationStack;
