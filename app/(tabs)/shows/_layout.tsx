import { useDefaultScreenOptions } from "@/hooks";
import { Stack } from "expo-router";
import type { FC } from "react";

const ShowsStack: FC = () => {
    const screenOptions = useDefaultScreenOptions();

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default ShowsStack;
