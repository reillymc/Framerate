import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "@reillymc/react-native-components";

import { getStars } from "./helpers";
import { StarIcon } from "./starIcon";

type Props = {
    /**
     * Rating Value. Should be between 0 and `maxStars`.
     */
    rating: number;

    /**
     * Custom color for the filled stars.
     *
     * @default '#fdd835'
     */
    color?: string;

    /**
     * Custom color for the empty stars.
     *
     * @default color
     */
    emptyColor?: string;

    /**
     * Total amount of stars to display.
     *
     * @default 5
     */
    maxStars?: number;

    /**
     * Size of the stars.
     *
     * @default 32
     */
    starSize?: number;

    /**
     * Custom style for the component.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * Custom style for the star component.
     */
    starStyle?: StyleProp<ViewStyle>;
};

export const StarRatingDisplay = ({
    rating,
    maxStars = 5,
    starSize = 32,
    color,
    emptyColor = color,
    style,
    starStyle,
}: Props) => {
    const { theme } = useTheme();
    return (
        <View
            style={[styles.starRating, style]}
            accessibilityLabel={`star rating. ${rating} stars.`}
        >
            {getStars(rating, maxStars).map((starType, i) => {
                return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: no other key available
                    <View key={i} style={[styles.star, starStyle]}>
                        <StarIcon
                            index={i}
                            type={starType}
                            size={starSize}
                            color={
                                starType === "empty"
                                    ? (emptyColor ?? theme.color.primaryLight)
                                    : (color ?? theme.color.primaryLight)
                            }
                        />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    starRating: {
        flexDirection: "row",
    },
    star: {
        marginHorizontal: 5,
    },
});
