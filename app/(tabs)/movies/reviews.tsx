import { ReviewSummaryCard, useReviews } from "@/modules/review";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Reviews: FC = () => {
    const { data: reviews } = useReviews();

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Reviews",
                }}
            />
            <FlatList
                data={reviews}
                contentInsetAdjustmentBehavior="automatic"
                CellRendererComponent={({ children }) => (
                    <View style={styles.pageElement}>{children}</View>
                )}
                renderItem={({ item }) => (
                    <ReviewSummaryCard
                        key={item.reviewId}
                        review={item}
                        onPress={() =>
                            router.push({
                                pathname: "/movies/movie",
                                params: {
                                    mediaId: item.mediaId,
                                    mediaTitle: item.mediaTitle,
                                    mediaPosterUri: item.mediaPosterUri,
                                },
                            })
                        }
                        onPressMore={() =>
                            router.push({
                                pathname: "/movies/review",
                                params: { reviewId: item.reviewId },
                            })
                        }
                    />
                )}
            />
        </>
    );
};

export default Reviews;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
    });
