import { useDefaultScreenOptions } from "@/hooks";
import { Stack } from "expo-router";
import type { FC } from "react";

const ShowsStack: FC = () => {
    const screenOptions = useDefaultScreenOptions();

    return (
        <Stack screenOptions={screenOptions} initialRouteName="index">
            <Stack.Screen name="index" />
            <Stack.Screen name="show" />
            <Stack.Screen name="reviews" />
            <Stack.Screen name="browse" />
            <Stack.Screen
                name="editReview"
                options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
                name="editWatch"
                options={{ presentation: "formSheet" }}
            />
            <Stack.Screen name="watchlist" />
            <Stack.Screen
                name="season/editReview"
                options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
                name="season/editWatch"
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.3],
                }}
            />
        </Stack>
    );
};

export default ShowsStack;
