import type { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { getRatingLabel, ReviewDisplay } from "@/modules/review";
import { useShowReview } from "@/modules/showReview";
import { useCurrentUserConfig } from "@/modules/user";

import { HeaderIconAction } from "@/components";

const Review: FC = () => {
    const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});

    const { configuration } = useCurrentUserConfig();
    const { data: review } = useShowReview(reviewId);

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
                    headerRight: () => (
                        <HeaderIconAction
                            iconSet={Octicons}
                            iconName="pencil"
                            onPress={() =>
                                router.push({
                                    pathname: "/shows/editWatch",
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

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.large,
        },
    });
