import { NAVIGATION_BAR_HEIGHT } from "@/constants/layout";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { Tabs } from "expo-router";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type CustomTabBarProps = Parameters<
    NonNullable<Parameters<typeof Tabs>[0]["tabBar"]>
>[0];

export const CustomTabBar: FC<CustomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={styles.tabBar}>
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
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.5 : 1,
                        })}
                    >
                        <Text
                            variant={"heading"}
                            style={
                                isFocused ? styles.tabLabelFocussed : undefined
                            }
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const createStyles = ({ theme: { color, spacing } }: ThemedStyles) =>
    StyleSheet.create({
        tabBar: {
            position: "absolute",
            left: 290,
            height: NAVIGATION_BAR_HEIGHT,
            paddingTop: spacing.tiny,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            gap: spacing.medium,
        },
        tabLabelFocussed: {
            color: color.primary,
            textDecorationLine: "underline",
            textDecorationStyle: "double",
        },
    });
