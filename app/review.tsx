import { useReview } from "@/modules/review";
import { Text } from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams } from "expo-router";
import type { FC } from "react";
import { View } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const Review: FC = () => {
    const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

    const { data: review } = useReview(reviewId);

    return (
        <>
            <Stack.Screen
                options={{
                    title: review?.date ?? "...",
                }}
            />
            <View>
                <StarRatingDisplay
                    rating={review?.rating ?? 0}
                    enableHalfStar
                />
                <Text>{review?.reviewTitle}</Text>
                <Text>{review?.reviewDescription}</Text>
            </View>
        </>
    );
};

export default Review;
