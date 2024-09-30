import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { ratingToStars } from "../helpers";
import type { ReviewDetails } from "../services";

interface ReviewDisplayProps {
    review: ReviewDetails;
}

export const ReviewDisplay: FC<ReviewDisplayProps> = ({ review }) => {
    const styles = useThemedStyles(createStyles, {});

    const rating = ratingToStars(review.rating ?? 0);

    return (
        <>
            <StarRatingDisplay
                rating={rating}
                style={{ justifyContent: "center" }}
                enableHalfStar
                maxStars={10}
                starSize={18}
            />
            {!!review.reviewTitle && <Text>{review.reviewTitle}</Text>}
            <Text style={styles.informationSection}>
                {review.reviewDescription}
            </Text>
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
        informationSection: {
            marginTop: padding.large,
        },
    });
