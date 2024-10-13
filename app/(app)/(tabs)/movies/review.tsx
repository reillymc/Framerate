import { useMovieReview } from "@/modules/movieReview";
import { ReviewDisplay, getRatingLabel } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";
import {
    IconActionV2,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";

const Review: FC = () => {
    const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});

    const { configuration } = useCurrentUserConfig();
    const { data: review } = useMovieReview(reviewId);

    return (
        <>
            <Stack.Screen
                options={{
                    title: review?.rating
                        ? getRatingLabel(
                              review.rating,
                              configuration.ratings.starCount,
                          )
                        : "Watched",
                    headerRight: () =>
                        review?.rating ? (
                            <IconActionV2
                                iconName="pencil"
                                onPress={() =>
                                    router.push({
                                        pathname: "/movies/editReview",
                                        params: { reviewId },
                                    })
                                }
                            />
                        ) : null,
                }}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                {review && (
                    <ReviewDisplay
                        review={review}
                        starCount={configuration.ratings.starCount}
                    />
                )}
            </ScrollView>
        </>
    );
};

export default Review;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
        },
    });
