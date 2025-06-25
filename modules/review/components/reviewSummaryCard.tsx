import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { Poster, StarRatingDisplay, usePosterDimensions } from "@/components";

import { ratingToStars } from "../helpers";
import type { Review } from "../models";

interface ReviewSummaryCardProps {
    review: Review;
    starCount: number;
    mediaTitle: string;
    mediaDate?: string;
    mediaPosterPath?: string;
    onPress: () => void;
    onOpenReview: () => void;
}

export const ReviewSummaryCard: FC<ReviewSummaryCardProps> = ({
    review,
    starCount,
    mediaDate,
    mediaPosterPath,
    mediaTitle,
    onPress,
    onOpenReview,
}) => {
    const { width } = usePosterDimensions({ size: "tiny" });
    const styles = useThemedStyles(createStyles, {
        starCount,
        posterWidth: width,
    });

    const rating = review.rating
        ? ratingToStars(review.rating, starCount)
        : undefined;

    const releaseYear = mediaDate
        ? new Date(mediaDate).getFullYear()
        : undefined;

    const hasRating = rating !== undefined;
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.topContainer}>
                <Poster
                    imageUri={mediaPosterPath}
                    size="tiny"
                    removeMargin
                    onOpenReview={onOpenReview}
                />
                <View style={styles.headingContainer}>
                    <View style={styles.headingTitleContainer}>
                        <Text
                            variant="title"
                            style={styles.title}
                            numberOfLines={1}
                        >
                            {mediaTitle}
                        </Text>
                        <Text key="date" variant="label">
                            {releaseYear}
                        </Text>
                    </View>
                    {rating && (
                        <StarRatingDisplay
                            rating={rating}
                            style={styles.stars}
                            starStyle={{ marginHorizontal: 0 }}
                            maxStars={starCount}
                            starSize={24}
                        />
                    )}
                    {!(rating || review.description) && (
                        <View style={styles.compactInformationSection}>
                            <Text
                                variant="caption"
                                style={styles.numericRating}
                            >
                                {"Watched"}
                            </Text>
                            <Text variant="caption">
                                {review.date &&
                                    new Date(review.date).toDateString()}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            {!!review.description && (
                <View style={styles.body}>
                    <View style={styles.bodyDecoration}>
                        <Text
                            variant="heading"
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={styles.numericRating}
                        >
                            {rating ? `${rating}/${starCount}` : "Watched"}
                        </Text>
                    </View>
                    <Text numberOfLines={3} style={styles.description}>
                        {review.description}
                    </Text>
                </View>
            )}
            {hasRating && (
                <View style={styles.informationSection}>
                    {review.description ? (
                        <View />
                    ) : (
                        <View style={styles.altInformationInnerContainer}>
                            <Text
                                variant="heading"
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={[styles.numericRating, styles.altRating]}
                            >
                                {rating ? `${rating}/${starCount}` : "Watched"}
                            </Text>
                        </View>
                    )}

                    <Text variant="caption">
                        {review.date && new Date(review.date).toDateString()}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

const createStyles = (
    { theme: { spacing, border, color } }: ThemedStyles,
    {
        starCount,
        posterWidth,
    }: Pick<ReviewSummaryCardProps, "starCount"> & { posterWidth: number },
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginTop: spacing.tiny,
            marginBottom: spacing.small,
            backgroundColor: color.foreground,
            borderRadius: border.radius.loose,
            padding: spacing.small,
        },
        topContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        headingContainer: {
            flex: 1,
            gap: spacing.small,
            marginLeft: spacing.small,
            marginRight: spacing.tiny,
        },
        headingTitleContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: spacing.small,
        },
        title: {
            flexShrink: 1,
        },

        stars: {
            marginHorizontal: -1,
            flexDirection: "row",
            justifyContent: starCount >= 10 ? "space-between" : "flex-start",
            gap: starCount <= 5 ? spacing.small : 0,
        },
        body: {
            marginTop: spacing.small,
            flexDirection: "row",
        },
        bodyDecoration: {
            width: posterWidth + 2,
            paddingHorizontal: 1,
            marginRight: spacing.tiny,
            alignItems: "center",
        },
        numericRating: {
            color: color.textSecondary,
        },
        description: {
            flexShrink: 1,
            marginLeft: spacing.tiny,
        },
        informationSection: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: spacing.medium,
            marginBottom: spacing.small,
            marginLeft: spacing.small,
            marginRight: spacing.tiny,
        },
        compactInformationSection: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: spacing.small,
            marginRight: spacing.tiny,
        },
        altInformationInnerContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            paddingBottom: 3,
        },
        altRating: {
            width: 40,
            marginRight: spacing.small,
            marginBottom: -3,
        },
    });
