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

    return (
        <>
            <Stack.Screen
                options={{
                    title: review?.date ?? "...",
                    headerRight: () => (
                        <IconActionV2
                            iconName="pencil"
                            onPress={() =>
                                router.push({
                                    pathname: "editReview",
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
                    rating={ratingToStars(review?.rating ?? 0)}
                    enableHalfStar
                    maxStars={10}
                    starSize={26}
                />
                <Text>{review?.reviewTitle}</Text>
                <Text>{review?.reviewDescription}</Text>
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
    });

export default Review;
