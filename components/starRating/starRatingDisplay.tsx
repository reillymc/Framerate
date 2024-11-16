import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
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

const defaultColor = "#fdd835";

export const StarRatingDisplay = ({
    rating,
    maxStars = 5,
    starSize = 32,
    color = defaultColor,
    emptyColor = color,
    style,
    starStyle,
}: Props) => {
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
                            color={starType === "empty" ? emptyColor : color}
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
