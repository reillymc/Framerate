import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { Tabs } from "expo-router";
import type { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    ZoomInEasyDown,
    ZoomOutEasyDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomTabBarProps = Parameters<
    NonNullable<Parameters<typeof Tabs>[0]["tabBar"]>
>[0] & {
    show: boolean;
};

export const CustomTabBar: FC<CustomTabBarProps> = ({
    state,
    descriptors,
    navigation,
    show,
}) => {
    const { bottom } = useSafeAreaInsets();
    const styles = useThemedStyles(createStyles, { bottom });

    if (!show) {
        return null;
    }

    return (
        <Animated.View
            entering={ZoomInEasyDown}
            exiting={ZoomOutEasyDown}
            style={styles.tabBar}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    typeof options.tabBarLabel === "string"
                        ? options.tabBarLabel
                        : "";

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!(isFocused || event.defaultPrevented)) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={
                            isFocused ? { selected: true } : undefined
                        }
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={({ pressed }) => [
                            styles.tab,
                            { opacity: pressed ? 0.5 : 1 },
                        ]}
                    >
                        <Text
                            variant={isFocused ? "bodyEmphasized" : "body"}
                            style={
                                isFocused ? styles.tabLabelFocussed : undefined
                            }
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </Animated.View>
    );
};

const createStyles = (
    { theme: { color, padding } }: ThemedStyles,
    props: { bottom: number },
) =>
    StyleSheet.create({
        tabBar: {
            position: "absolute",
            flexDirection: "row",
            backgroundColor: color.foreground,
            height: 50,
            bottom: props.bottom,
            marginLeft: padding.pageHorizontal / 2,
            marginRight: padding.pageHorizontal / 2,
            borderRadius: 25,
            zIndex: 999,
            alignSelf: "center",
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            gap: padding.large,
            paddingHorizontal: padding.large,
        },
        tab: {
            justifyContent: "center",
            alignItems: "center",
        },
        tabLabelFocussed: {
            color: color.primary,
        },
    });
