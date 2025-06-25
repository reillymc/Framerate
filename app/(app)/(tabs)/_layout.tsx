import type { FC } from "react";
import { Tabs, useSegments } from "expo-router";

import { CustomTabBar } from "@/components";

const MAIN_TABS = ["movies", "shows", "browse"];

const TabLayout: FC = () => {
    const segments = useSegments();

    const lastSegment = segments.at(-1);

    const show = lastSegment ? MAIN_TABS.includes(lastSegment) : false;

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
};

export default TabLayout;
