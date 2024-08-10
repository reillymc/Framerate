import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { TmdbImage } from "@/components";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import type { FC } from "react";

export interface WatchListEntrySummaryItemProps {
    item: Partial<WatchlistEntrySummary>;
    index?: number;
    scrollValue?: Animated.SharedValue<number>;
    width?: number;
    height?: number;
    onPress?: () => void;
}

export const WatchListEntrySummaryItem: FC<WatchListEntrySummaryItemProps> = ({
    item,
    index,
    scrollValue,
    width = 170,
    height = 210,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles, { width, height });

    const animatedStyle = useAnimatedStyle(() => {
        if (
            scrollValue === undefined ||
            index === undefined ||
            Platform.OS === "web"
        )
            return { width, height };

        const getOffset = (indexOffset: number) => {
            return indexOffset * width + 100;
        };

        const translateX = interpolate(
            scrollValue.value,
            [
                getOffset(index - 5),
                getOffset(index - 1),
                getOffset(index),
                getOffset(index + 1),
            ],
            [-600, -10, 0, -10],
        );

        const scale = interpolate(
            scrollValue.value,
            [getOffset(index - 1), getOffset(index), getOffset(index + 1)],
            [0.85, 1, 0.92],
        );

        return {
            transform: [{ translateX }, { scale }],
            zIndex: -index,
        };
    });

    return (
        <Animated.View key={item.mediaId} style={animatedStyle}>
            <Pressable onPress={onPress}>
                <View style={styles.container}>
                    <TmdbImage
                        path={item.mediaPosterUri}
                        type="poster"
                        style={{
                            width,
                            height,
                            borderRadius: 8,
                        }}
                    />
                </View>
            </Pressable>
        </Animated.View>
    );
};

WatchListEntrySummaryItem.displayName = "WatchListEntrySummaryItem";

const createStyles = (
    { theme: { color } }: ThemedStyles,
    { height, width }: { width: number; height: number },
) =>
    StyleSheet.create({
        container: {
            width,
            height,
            shadowColor: color.shadow,
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {
                width: 5,
                height: 5,
            },
        },
    });
