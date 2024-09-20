import { ratingToStars, useReview } from "@/modules/review";
import {
    IconActionV2,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const Review: FC = () => {
    const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});

    const { data: review } = useReview(reviewId);

    const rating = ratingToStars(review?.rating ?? 0);

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${rating} Star${rating !== 1 ? "s" : ""}`,
                    headerRight: () => (
                        <IconActionV2
                            iconName="pencil"
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/editReview",
                                    params: { reviewId },
                                })
                            }
                        />
                    ),
                }}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <StarRatingDisplay
                    rating={rating}
                    style={{ justifyContent: "center" }}
                    enableHalfStar
                    maxStars={10}
                    starSize={18}
                />
                {!!review?.reviewTitle && <Text>{review?.reviewTitle}</Text>}
                <Text style={styles.informationSection}>
                    {review?.reviewDescription}
                </Text>
                <Text
                    variant="bodyEmphasized"
                    style={styles.informationSection}
                >
                    <Text variant="body">Watched </Text>
                    {review?.date && (
                        <>
                            <Text variant="body">on </Text>
                            {review.date}
                        </>
                    )}
                    {!!review?.venue && (
                        <>
                            <Text variant="body"> at </Text>
                            {review?.venue}
                        </>
                    )}
                    {review?.company?.length ? (
                        <Text variant="body"> with:</Text>
                    ) : (
                        "."
                    )}
                </Text>
                {!!review?.company?.length &&
                    review?.company?.map(({ userId, firstName, lastName }) => (
                        <Text key={userId} variant="bodyEmphasized">
                            {`    - ${firstName ?? "..."} ${lastName ?? "..."}`}
                        </Text>
                    ))}
            </ScrollView>
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

export default Review;
