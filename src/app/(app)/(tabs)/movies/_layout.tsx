import type { FC } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";

import { useDefaultScreenOptions } from "@/hooks";

const MoviesStack: FC = () => {
    const screenOptions = useDefaultScreenOptions();

    return (
        <Stack screenOptions={screenOptions} initialRouteName="index">
            <Stack.Screen name="index" />
            <Stack.Screen name="movie" />
            <Stack.Screen name="watches" />
            <Stack.Screen name="browse" />
            <Stack.Screen
                name="editWatch"
                options={{
                    presentation: Platform.OS === "ios" ? "formSheet" : "modal",
                }}
            />
            <Stack.Screen name="watchlist" />
            <Stack.Screen name="collections" />
            <Stack.Screen name="collection" />
            <Stack.Screen
                name="editCollection"
                options={{
                    presentation: "modal",
                }}
            />
        </Stack>
    );
};

export default MoviesStack;
