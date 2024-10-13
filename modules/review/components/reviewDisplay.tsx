import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { ratingToStars } from "../helpers";
import type { Review } from "../models";

interface ReviewDisplayProps {
    review: Review;
    starCount: number;
}

export const ReviewDisplay: FC<ReviewDisplayProps> = ({
    review,
    starCount,
}) => {
    const styles = useThemedStyles(createStyles, {});

    const rating =
        review.rating !== undefined
            ? ratingToStars(review.rating, starCount)
            : undefined;

    return (
        <>
            {!!rating && (
                <StarRatingDisplay
                    rating={rating}
                    style={styles.ratingDisplay}
                    enableHalfStar
                    maxStars={starCount}
                    starSize={180 / starCount}
                />
            )}
            {!!review.title && (
                <Text style={styles.informationSection}>{review.title}</Text>
            )}
            {!!review.description && (
                <Text style={styles.informationSection}>
                    {review.description}
                </Text>
            )}
            <Text variant="bodyEmphasized" style={styles.informationSection}>
                <Text variant="body">Watched </Text>
                {review.date && (
                    <>
                        <Text variant="body">on </Text>
                        {review.date}
                    </>
                )}
                {!!review.venue && (
                    <>
                        <Text variant="body"> at </Text>
                        {review.venue}
                    </>
                )}
                {review.company?.length ? (
                    <Text variant="body"> with:</Text>
                ) : (
                    "."
                )}
            </Text>
            {!!review.company?.length &&
                review.company?.map(({ userId, firstName, lastName }) => (
                    <Text key={userId} variant="bodyEmphasized">
                        {`    - ${firstName ?? "..."} ${lastName ?? "..."}`}
                    </Text>
                ))}
        </>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
        },
        ratingDisplay: {
            justifyContent: "center",
            marginBottom: padding.large,
        },
        informationSection: {
            marginBottom: padding.large,
        },
    });
