import { Poster, StarRatingDisplay, usePosterDimensions } from "@/components";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ratingToStars } from "../helpers";
import type { Review } from "../models";

interface ReviewSummaryCardProps {
    review: Review;
    starCount: number;
    mediaTitle: string;
    mediaDate?: Date;
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

    const releaseYear = null; // TODO: mediaDate?.getFullYear() ?? null;

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
                        <Text key="date" variant="label" style={styles.date}>
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
        </Pressable>
    );
};

const createStyles = (
    { theme: { padding, border, color }, styles: { text } }: ThemedStyles,
    {
        starCount,
        posterWidth,
    }: Pick<ReviewSummaryCardProps, "starCount"> & { posterWidth: number },
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginTop: padding.tiny,
            marginBottom: padding.small,
            backgroundColor: color.foreground,
            borderRadius: border.radius.loose,
            padding: padding.small,
        },
        topContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        headingContainer: {
            flex: 1,
            gap: padding.small,
            marginLeft: padding.small,
            marginRight: padding.tiny,
        },
        headingTitleContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: padding.small,
        },
        title: {
            // TODO a 'compact' options in RNC that excludes the LINE_HEIGHT_MODIFIER
            lineHeight: text.lineHeight.title - 14,
            flexShrink: 1,
        },
        date: {
            // TODO an 'alignTop' option in RNC that takes another text variant to grab line height from
            lineHeight: text.lineHeight.label - 3,
        },
        stars: {
            marginHorizontal: -1,
            flexDirection: "row",
            justifyContent: starCount >= 10 ? "space-between" : "flex-start",
            gap: starCount <= 5 ? padding.small : 0,
        },
        body: {
            marginTop: padding.small,
            flexDirection: "row",
        },
        bodyDecoration: {
            width: posterWidth + 2,
            paddingHorizontal: 1,
            marginRight: padding.tiny,
            alignItems: "center",
        },
        numericRating: {
            color: color.textSecondary,
        },
        description: {
            flexShrink: 1,
            marginLeft: padding.tiny,
        },
        informationSection: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: padding.regular,
            marginBottom: padding.small,
            marginHorizontal: padding.small,
        },
        altInformationInnerContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            paddingBottom: 3,
        },
        altRating: {
            width: 40,
            marginRight: 8,
            marginBottom: -3,
        },
    });
