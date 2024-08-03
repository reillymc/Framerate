import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import {
    IconActionV2,
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ParallaxScrollView, TmdbImage } from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useMovieDetails } from "@/hooks";
import { ratingToStars, useReviews } from "@/modules/review";
import {
    useDeleteWatchlistEntry,
    useSaveWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";

const Movie: React.FC = () => {
    const { mediaId: mediaIdParam } = useLocalSearchParams<{
        mediaId: string;
    }>();

    const mediaId = Number.parseInt(mediaIdParam ?? "", 10);

    const { data: movie } = useMovieDetails({
        mediaId,
    });

    const { data: watchlistEntry } = useWatchlistEntry(
        MediaType.Movie,
        mediaId,
    );
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();
    const { mutate: saveWatchlistEntry } = useSaveWatchlistEntry();

    const router = useRouter();
    const { data: reviews } = useReviews(mediaId);
    const { theme } = useTheme();

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
                <Text
                    variant="heading"
                    style={styles.floatingTagline}
                    numberOfLines={3}
                >
                    {movie?.tagline}
                </Text>
                <View style={styles.pageContent}>
                    <Text variant="body">{movie?.overview}</Text>
                    <Text variant="body">{movie?.year}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: theme.padding.large,
                        }}
                    >
                        <Pressable
                            style={{
                                backgroundColor: theme.color.primary,
                                borderRadius: 40,
                                padding: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                width: "49%",
                            }}
                            onPress={() => {
                                if (watchlistEntry) {
                                    deleteWatchlistEntry({
                                        mediaId,
                                        mediaType: MediaType.Movie,
                                    });
                                    return;
                                }

                                if (!movie) return;
                                saveWatchlistEntry({
                                    mediaId,
                                    mediaType: MediaType.Movie,
                                    mediaTitle: movie.title,
                                    imdbId: movie.imdbId,
                                    mediaReleaseDate: movie.releaseDate
                                        ?.toISOString()
                                        .split("T")[0],
                                    mediaPosterUri: movie.poster,
                                });
                            }}
                        >
                            <IconActionV2
                                size="large"
                                iconName={watchlistEntry ? "eye-closed" : "eye"}
                                iconStyle={{
                                    color: "white",
                                }}
                                containerStyle={{
                                    backgroundColor: "transparent",
                                }}
                            />
                            <Text
                                variant="label"
                                style={{
                                    color: "white",
                                    marginLeft: theme.padding.small / 2,
                                }}
                            >
                                {watchlistEntry
                                    ? "Take off Watchlist"
                                    : "Save to Watchlist"}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                backgroundColor: theme.color.primary,
                                borderRadius: 40,
                                padding: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                width: "44%",
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: "editReview",
                                    params: { mediaId },
                                })
                            }
                        >
                            <IconActionV2
                                size="large"
                                iconName="pencil"
                                iconStyle={{
                                    color: "white",
                                }}
                                containerStyle={{
                                    backgroundColor: "transparent",
                                }}
                            />
                            <Text
                                variant="label"
                                style={{
                                    color: "white",
                                    marginLeft: theme.padding.small / 2,
                                }}
                            >
                                Add a Review
                            </Text>
                        </Pressable>
                    </View>

                    <Text variant="title">Reviews</Text>
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
                                                {new Date(
                                                    item.date,
                                                ).toDateString()}
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
                </View>
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
            top: 0,
            width: "60%",
            height: 80,
        },
        pageContent: {
            marginTop: 20,
        },
        list: {
            marginTop: padding.large,
        },
        reviewCard: {
            height: 120,
        },
    });
