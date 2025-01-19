import { StarRatingDisplay } from "@/components";
import { displayFull } from "@/helpers/dateHelper";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet } from "react-native";
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
                        {displayFull(review.date)}
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
                review.company?.map(({ companyId, firstName, lastName }) => (
                    <Text key={companyId} variant="bodyEmphasized">
                        {`    - ${firstName ?? "..."} ${lastName ?? "..."}`}
                    </Text>
                ))}
        </>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.large,
        },
        ratingDisplay: {
            justifyContent: "center",
            marginBottom: spacing.large,
        },
        informationSection: {
            marginBottom: spacing.large,
        },
    });
