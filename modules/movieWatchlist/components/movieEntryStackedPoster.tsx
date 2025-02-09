import { Platform } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
    type SharedValue,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

import { Poster, type PosterProperties } from "@/components";
import type { FC } from "react";
import type { MovieWatchlistEntry } from "../models";

export interface MovieEntryStackedPosterProps
    extends Pick<MovieWatchlistEntry, "posterPath"> {
    index?: number;
    posterProperties: PosterProperties;
    scrollValue?: SharedValue<number>;
    onPress?: () => void;
    onAddReview?: () => void;
    onRemoveFromWatchlist?: () => void;
}

export const MovieEntryStackedPoster: FC<MovieEntryStackedPosterProps> = ({
    index,
    posterPath,
    posterProperties,
    scrollValue,
    onPress,
    onAddReview,
    onRemoveFromWatchlist,
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        if (
            scrollValue === undefined ||
            index === undefined ||
            Platform.OS === "web"
        )
            return {};

        const getOffset = (indexOffset: number) =>
            indexOffset * posterProperties.width;

        const translateX = interpolate(
            scrollValue.value,
            [
                getOffset(index - 5),
                getOffset(index - 2),
                getOffset(index - 1),
                getOffset(index),
                getOffset(index + 1),
            ],
            [
                -(posterProperties.width * 5),
                -(posterProperties.width * 1.55),
                -(posterProperties.width * 0.7),
                0,
                -(posterProperties.width * 0.01),
            ],
        );

        const scale = interpolate(
            scrollValue.value,
            [
                getOffset(index - 6),
                getOffset(index - 5),
                getOffset(index - 1),
                getOffset(index),
                getOffset(index + 1),
            ],
            [0, 0, 0.85, 1, 0.92],
        );

        return {
            transform: [{ translateX }, { scale }],
            zIndex: -index,
        };
    });

    return (
        <Animated.View
            style={animatedStyle}
            entering={FadeIn.springify().mass(0.55)}
            exiting={FadeOut.springify().mass(0.55)}
            layout={LinearTransition}
        >
            <Poster
                imageUri={posterPath}
                size="small"
                removeMargin
                onWatchlist
                onPress={onPress}
                onAddReview={onAddReview}
                onToggleWatchlist={onRemoveFromWatchlist}
            />
        </Animated.View>
    );
};
