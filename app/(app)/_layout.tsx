import { useDefaultScreenOptions } from "@/hooks";
import { useSession } from "@/modules/auth";
import { Redirect, Stack } from "expo-router";

const RootLayoutNavigator = () => {
    const { session, userId, isLoading } = useSession();

    const screenOptions = useDefaultScreenOptions();

    if (isLoading) {
        return null;
    }

    if (!(session && userId)) {
        return <Redirect href="/(auth)" />;
    }

    return (
        <Stack screenOptions={screenOptions} initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ presentation: "modal" }} />
            <Stack.Screen
                name="administration"
                options={{ presentation: "modal" }}
            />
            <Stack.Screen name="credits" options={{ presentation: "modal" }} />
            <Stack.Screen
                name="selectionModal"
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.5, 1.0],
                    sheetGrabberVisible: true,
                    sheetExpandsWhenScrolledToEdge: true,
                }}
            />
        </Stack>
    );
};

export default RootLayoutNavigator;
