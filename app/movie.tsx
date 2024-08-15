import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import {
    Button,
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
import {
    ReviewRatingTimeline,
    ratingToStars,
    useReviews,
} from "@/modules/review";
import {
    useDeleteWatchlistEntry,
    useSaveWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import { openURL } from "expo-linking";

const Movie: React.FC = () => {
    const {
        mediaId: mediaIdParam,
        mediaTitle,
        mediaPosterUri,
    } = useLocalSearchParams<{
        mediaId: string;
        mediaTitle?: string;
        mediaPosterUri?: string;
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
            <Stack.Screen options={{ title: movie?.title ?? mediaTitle }} />
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
                    path={movie?.poster ?? mediaPosterUri}
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
                    <Text variant="bodyEmphasized"> - {movie?.year}</Text>
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
                                paddingLeft: 6,
                                paddingVertical: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                width: "51%",
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
                                    marginLeft: 1,
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
                                paddingLeft: 6,
                                paddingVertical: 8,
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
                                    marginLeft: 1,
                                }}
                            >
                                Add a Review
                            </Text>
                        </Pressable>
                    </View>

                    {!!reviews?.length && reviews.length > 1 && (
                        <>
                            <Text variant="title">Reviews</Text>
                            <ReviewRatingTimeline reviews={reviews} />
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
                                                contentItems={
                                                    item.date
                                                        ? [
                                                              <Text key="date">
                                                                  {new Date(
                                                                      item.date,
                                                                  ).toDateString()}
                                                              </Text>,
                                                          ]
                                                        : undefined
                                                }
                                            />,
                                        ]}
                                        onPress={() =>
                                            router.push({
                                                pathname: "review",
                                                params: {
                                                    reviewId: item.reviewId,
                                                },
                                            })
                                        }
                                    />
                                )}
                                contentContainerStyle={styles.list}
                            />
                        </>
                    )}
                </View>
                <Button
                    label="IMDB"
                    variant="flat"
                    size="small"
                    onPress={() =>
                        openURL(`https://www.imdb.com/title/${movie?.imdbId}/`)
                    }
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
