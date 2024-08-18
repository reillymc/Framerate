import { Platform } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    type SharedValue,
} from "react-native-reanimated";

import { Poster, usePosterDimensions } from "@/components/poster";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import type { FC } from "react";

export interface WatchListEntrySummaryItemProps {
    item: Partial<WatchlistEntrySummary>;
    index?: number;
    scrollValue?: SharedValue<number>;
    onPress?: () => void;
}

export const WatchListEntrySummaryItem: FC<WatchListEntrySummaryItemProps> = ({
    item,
    index,
    scrollValue,
    onPress,
}) => {
    const { width } = usePosterDimensions({ size: "small" });

    const animatedStyle = useAnimatedStyle(() => {
        if (
            scrollValue === undefined ||
            index === undefined ||
            Platform.OS === "web"
        )
            return {};

        const getOffset = (indexOffset: number) => indexOffset * width;

        const translateX = interpolate(
            scrollValue.value,
            [
                getOffset(index - 5),
                getOffset(index - 2),
                getOffset(index - 1),
                getOffset(index),
                getOffset(index + 1),
            ],
            [-560, -180, -85, 0, -10],
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
            <Poster
                imageUri={item.mediaPosterUri}
                size="small"
                removeMargin
                onPress={onPress}
            />
        </Animated.View>
    );
};

WatchListEntrySummaryItem.displayName = "WatchListEntrySummaryItem";
