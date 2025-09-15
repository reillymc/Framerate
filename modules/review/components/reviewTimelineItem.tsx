import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
    Rating,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ratingToStars } from "../helpers";
import { AbsoluteRatingScale, type Review } from "../models";

interface ReviewTimelineItemProps {
    review: Review;
    starCount: number;
    hideTimeline?: boolean;
    onPress: () => void;
}

export const ReviewTimelineItem: FC<ReviewTimelineItemProps> = ({
    review,
    starCount,
    hideTimeline,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles, {});

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
                    {!hideTimeline && <View style={styles.timeline} />}
                </View>
            </View>
            <View style={styles.reviewContainer}>
                <View style={styles.topContainer}>
                    {!!review.rating && (
                        <Rating
                            value={review.rating}
                            scale={AbsoluteRatingScale}
                            max={starCount}
                            style={{
                                icon: {
                                    size: Math.min(220 / starCount, 28),
                                },
                            }}
                        />
                    )}

                    <Text
                        variant="heading"
                        numberOfLines={1}
                        style={review.rating ? styles.numericRating : undefined}
                    >
                        {review.rating
                            ? `${ratingToStars(review.rating, starCount)}/${starCount}`
                            : "Watched"}
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

const createStyles = ({
    theme: { spacing, color, font, border },
}: ThemedStyles) =>
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
            borderWidth: border.width.regular,
            borderStyle: "dashed",
            marginTop: -1,
        },
        dateContainer: {
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.tiny,
        },
        date: {
            color: color.primary,
            fontFamily: font.familyWeight.bold800,
        },
        dateYear: {
            color: color.primary,
            fontFamily: font.familyWeight.bold600,
        },
        datePlaceholder: {
            color: color.textSecondary,
            fontFamily: font.familyWeight.bold600,
            marginTop: spacing.small,
            marginBottom: spacing.tiny,
        },
        reviewContainer: {
            marginBottom: spacing.large * 2,
            flex: 1,
        },
        topContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 10,
        },
        bodyContainer: {
            marginTop: spacing.small,
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
