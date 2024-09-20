import { CustomTabBar } from "@/components";
import { Tabs, useSegments } from "expo-router";
import type React from "react";

const MAIN_TABS = ["movies", "shows"];

const TabLayout: React.FC = () => {
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
            {/* <Tabs.Screen
                name="shows"
                options={{
                    tabBarLabel: "Shows",
                }}
            /> */}
        </Tabs>
    );
};

export default TabLayout;
