import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { ratingToStars } from "../helpers";
import type { Review } from "../models";

interface ReviewDetailsCardProps {
    review: Review;
    starCount: number;
    onPress: () => void;
}

export const ReviewDetailsCard: FC<ReviewDetailsCardProps> = ({
    review,
    starCount,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const rating = ratingToStars(review.rating, starCount);

    const date = review.date ? new Date(review.date) : undefined;

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.timelineContainer}>
                <View style={styles.dateContainer}>
                    {date ? (
                        <>
                            <Text variant="caption" style={styles.date}>
                                {date.toLocaleString("default", {
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </Text>
                            <Text style={styles.dateYear}>
                                {date.getFullYear()}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.datePlaceholder}>...</Text>
                    )}
                </View>
                <View style={styles.timelineClip}>
                    <View style={styles.timeline} />
                </View>
            </View>
            <View style={styles.reviewContainer}>
                <View style={styles.topContainer}>
                    <StarRatingDisplay
                        rating={rating}
                        style={styles.stars}
                        starStyle={{ marginHorizontal: 0 }}
                        enableHalfStar
                        maxStars={starCount}
                        starSize={Math.min(220 / starCount, 28)}
                    />
                    <Text
                        variant="heading"
                        numberOfLines={1}
                        style={styles.numericRating}
                    >
                        {rating}/{starCount}
                    </Text>
                </View>
                <View style={styles.bodyContainer}>
                    <Text numberOfLines={5} style={styles.description}>
                        {review.description}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const createStyles = ({ theme: { padding, color, font } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
        },
        timelineContainer: {
            alignItems: "center",
            justifyContent: "center",
            width: 56,
        },
        timelineClip: {
            width: 2,
            flex: 1,
            overflow: "hidden",
        },
        timeline: {
            borderColor: color.primary,
            width: 1,
            flex: 1,
            borderWidth: 2,
            borderStyle: "dashed",
            marginTop: -1,
        },
        dateContainer: {
            alignItems: "center",
            justifyContent: "center",
            padding: padding.tiny,
        },
        date: {
            color: color.primaryHighlight,
            fontFamily: font.familyWeight.bold800,
        },
        dateYear: {
            color: color.primaryHighlight,
            fontFamily: font.familyWeight.bold600,
        },
        datePlaceholder: {
            color: color.textSecondary,
            fontFamily: font.familyWeight.bold600,
            marginTop: padding.small,
            marginBottom: padding.tiny,
        },
        reviewContainer: {
            marginBottom: padding.large * 2,
            flex: 1,
        },
        topContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 10,
        },
        stars: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        bodyContainer: {
            marginTop: padding.small,
            flexDirection: "row",
        },
        numericRating: {
            flex: 1,
            textAlign: "right",
        },
        description: {
            flexShrink: 1,
        },
    });
