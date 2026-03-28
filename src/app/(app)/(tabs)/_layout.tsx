import type { FC } from "react";
import { Platform } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { useTheme } from "@reillymc/react-native-components";
import { NativeTabs } from "expo-router/unstable-native-tabs";

import { CustomTabBar } from "@/components";

const MAIN_TABS = ["movies", "shows", "browse"];

const TabLayout: FC = () => {
    const segments = useSegments();
    const { theme } = useTheme();

    const lastSegment = segments.at(-1);

    const show = lastSegment ? MAIN_TABS.includes(lastSegment) : false;

    if (Platform.OS === "web") {
        return (
            <Tabs
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <CustomTabBar {...props} show={show} />}
                initialRouteName="movies"
            >
                <Tabs.Screen
                    name="movies"
                    options={{
                        tabBarLabel: "Movies",
                    }}
                />
                <Tabs.Screen
                    name="shows"
                    options={{
                        tabBarLabel: "Shows",
                    }}
                />
            </Tabs>
        );
    }

    return (
        <NativeTabs iconColor={theme.color.primary}>
            <NativeTabs.Trigger name="movies">
                <NativeTabs.Trigger.Icon sf="film" />
                <NativeTabs.Trigger.Label>Movies</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="shows">
                <NativeTabs.Trigger.Icon sf="play.tv" />
                <NativeTabs.Trigger.Label>Shows</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
};

export default TabLayout;
