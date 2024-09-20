import { Poster } from "@/components";
import {
    Action,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { ratingToStars } from "../helpers";
import type { ReviewSummary } from "../services";

interface ReviewSummaryCardProps {
    review: ReviewSummary;
    onPress: () => void;
    onOpenReview: () => void;
}

export const ReviewSummaryCard: FC<ReviewSummaryCardProps> = ({
    review,
    onPress,
    onOpenReview,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const rating = ratingToStars(review?.rating ?? 0);

    const releaseYear = review?.mediaReleaseDate
        ? new Date(review.mediaReleaseDate).getFullYear()
        : null;

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.topContainer}>
                <Poster
                    imageUri={review.mediaPosterUri}
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
                            {review.mediaTitle}
                        </Text>
                        <Text key="date" variant="label" style={styles.date}>
                            {releaseYear}
                        </Text>
                    </View>
                    <StarRatingDisplay
                        rating={rating}
                        style={styles.stars}
                        starStyle={{ marginHorizontal: 0 }}
                        enableHalfStar
                        maxStars={10}
                        starSize={24}
                    />
                </View>
            </View>
            {!!review.reviewDescription && (
                <View style={styles.body}>
                    <View style={styles.bodyDecoration}>
                        <Text
                            variant="heading"
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={styles.numericRating}
                        >
                            {rating}/10
                        </Text>
                    </View>
                    <Text numberOfLines={3} style={styles.description}>
                        {review.reviewDescription}
                    </Text>
                </View>
            )}
            <View style={styles.informationSection}>
                {review.reviewDescription ? (
                    <Text variant="caption">
                        {review.date && new Date(review.date).toDateString()}
                    </Text>
                ) : (
                    <View style={styles.altInformationInnerContainer}>
                        <Text
                            variant="heading"
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={[styles.numericRating, styles.altRating]}
                        >
                            {rating}/10
                        </Text>
                        <Text variant="caption">
                            {review.date &&
                                new Date(review.date).toDateString()}
                        </Text>
                    </View>
                )}

                <Action
                    label="Read more..."
                    onPress={onOpenReview}
                    variant="primary"
                    size="small"
                />
            </View>
        </Pressable>
    );
};

const createStyles = ({
    theme: { padding, border, color },
    styles: { text },
}: ThemedStyles) =>
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
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: padding.small,
        },
        title: {
            // TODO a 'compact' options in RNC that excludes the LINE_HEIGHT_MODIFIER
            lineHeight: text.lineHeight.title - 16,
            flexShrink: 1,
        },
        date: {
            // TODO an 'alignTop' option in RNC that takes another text variant to grab line height from
            lineHeight: text.lineHeight.label - 3,
        },
        stars: {
            marginHorizontal: -1,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        body: {
            marginTop: padding.small,
            flexDirection: "row",
        },
        bodyDecoration: {
            width: 48,
            marginRight: padding.small,
            alignItems: "center",
        },
        numericRating: {
            color: color.textSecondary,
        },
        description: {
            flexShrink: 1,
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
