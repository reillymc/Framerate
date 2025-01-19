import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { BlurView } from "expo-blur";
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
            <BlurView
                style={styles.innerContainer}
                intensity={100}
                tint="systemThickMaterial"
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        typeof options.tabBarLabel === "string"
                            ? options.tabBarLabel
                            : undefined;

                    if (!label) return null;

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
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={({ pressed }) => [
                                styles.tab,
                                { opacity: pressed ? 0.5 : 1 },
                            ]}
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 16,
                                right: 16,
                            }}
                        >
                            <Text
                                variant={isFocused ? "bodyEmphasized" : "body"}
                                style={
                                    isFocused
                                        ? styles.tabLabelFocussed
                                        : undefined
                                }
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </BlurView>
        </Animated.View>
    );
};

const createStyles = (
    { theme: { color, spacing } }: ThemedStyles,
    props: { bottom: number },
) =>
    StyleSheet.create({
        tabBar: {
            position: "absolute",
            bottom: props.bottom,
            marginLeft: spacing.pageHorizontal / 2,
            marginRight: spacing.pageHorizontal / 2,
            zIndex: 999,
            alignSelf: "center",
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        innerContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            gap: spacing.large,
            borderRadius: 40,
            overflow: "hidden",
            paddingHorizontal: spacing.large,
            paddingVertical: spacing.small + spacing.tiny,
        },
        tab: {
            justifyContent: "center",
            alignItems: "center",
        },
        tabLabelFocussed: {
            color: color.primary,
        },
    });
