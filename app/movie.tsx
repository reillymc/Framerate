import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import {
    IconActionV2,
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ParallaxScrollView, TmdbImage } from "@/components";
import { useMovieDetails } from "@/hooks";
import { ratingToStars, useReviews } from "@/modules/review";

const Movie: React.FC = () => {
    const { mediaId: mediaIdParam } = useLocalSearchParams<{
        mediaId: string;
    }>();

    const mediaId = Number.parseInt(mediaIdParam ?? "", 10);

    const { data: movie } = useMovieDetails({
        mediaId,
    });

    const router = useRouter();
    const { data: reviews } = useReviews(mediaId);

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen options={{ title: movie?.title }} />
            <ParallaxScrollView
                headerImage={
                    <TmdbImage type="backdrop" path={movie?.backdrop} />
                }
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <TmdbImage
                    type="poster"
                    path={movie?.poster}
                    style={styles.floatingPoster}
                />
                <Text variant="heading" style={styles.floatingTagline}>
                    {movie?.tagline}
                </Text>
                <IconActionV2
                    size="large"
                    iconName="plus-circle"
                    onPress={() =>
                        router.push({
                            pathname: "editReview",
                            params: { mediaId },
                        })
                    }
                />
                <FlatList
                    contentInsetAdjustmentBehavior="automatic"
                    scrollEnabled={false}
                    data={reviews}
                    renderItem={({ item }) => (
                        <ListItem
                            key={item.reviewId}
                            style={styles.reviewCard}
                            heading={`${ratingToStars(item.rating)} Stars`}
                            contentRows={[
                                <ListItemRow
                                    key="details"
                                    contentItems={[
                                        <Text key="date">
                                            {new Date(item.date).toDateString()}
                                        </Text>,
                                    ]}
                                />,
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "review",
                                    params: { reviewId: item.reviewId },
                                })
                            }
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            </ParallaxScrollView>
        </>
    );
};

export default Movie;

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
            backgroundColor: color.background,
        },
        floatingPoster: {
            position: "absolute",
            top: -100,
            left: padding.pageHorizontal,
            width: 125,
            height: 187.5,
            borderRadius: 8,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            borderColor: color.background,
        },
        floatingTagline: {
            left: padding.pageHorizontal + 125,
            width: "60%",
        },
        list: {
            marginTop: padding.large,
        },
        reviewCard: {
            height: 120,
        },
    });
