import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
    useWindowDimensions,
} from "react-native";

import {
    IconActionV2,
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    ImdbButton,
    ParallaxScrollView,
    TmdbButton,
    TmdbImage,
    VidSrcButton,
} from "@/components";
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
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

    const { bottom } = useSafeAreaInsets();
    const mediaId = Number.parseInt(mediaIdParam ?? "", 10);
    const { width } = useWindowDimensions();
    const scheme = useColorScheme();

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
                scrollIndicatorInsets={{ top: 330, bottom: 50 }}
            >
                <View style={styles.floatingPosterContainer}>
                    <TmdbImage
                        style={styles.floatingPoster}
                        type="poster"
                        path={movie?.poster ?? mediaPosterUri}
                    />
                </View>
                <View style={styles.floatingTagline}>
                    <Text variant="heading" numberOfLines={3}>
                        {movie?.tagline}
                    </Text>
                </View>
                <View style={styles.pageContent}>
                    <Text variant="body">{movie?.overview}</Text>
                    <Text variant="bodyEmphasized" style={styles.section}>
                        Release Date: {movie?.releaseDate?.toLocaleDateString()}
                    </Text>

                    {!!reviews?.length && reviews.length > 1 && (
                        <>
                            <Text variant="title" style={styles.section}>
                                Reviews
                            </Text>
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
                                                pathname: "/review",
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
                <View style={styles.linksContainer}>
                    <TmdbButton
                        tmdbId={movie?.mediaId}
                        mediaType={MediaType.Movie}
                    />
                    <ImdbButton imdbId={movie?.imdbId} />
                    <VidSrcButton imdbId={movie?.imdbId} />
                </View>
            </ParallaxScrollView>
            <Canvas
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                }}
            >
                <Rect x={0} y={0} width={width} height={100}>
                    <LinearGradient
                        start={vec(width, 0)}
                        end={vec(width, 100 - bottom)}
                        colors={[
                            scheme === "light"
                                ? `${theme.color.background}00`
                                : "transparent",
                            theme.color.background,
                        ]}
                    />
                </Rect>
            </Canvas>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: theme.padding.large,
                    position: "absolute",
                    bottom: -bottom,
                    paddingBottom: bottom + theme.padding.regular,
                    left: 0,
                    right: 0,
                    paddingTop: theme.padding.regular,
                    paddingHorizontal: theme.padding.pageHorizontal / 1.5,
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: theme.color.primary,
                        borderRadius: 24,
                        paddingLeft: 6,
                        paddingVertical: 4,
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
                        borderRadius: 24,
                        paddingLeft: 6,
                        paddingVertical: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "44%",
                    }}
                    onPress={() =>
                        router.push({
                            pathname: "/editReview",
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
        </>
    );
};

export default Movie;

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: 80,
            backgroundColor: color.background,
            borderRadius: 16,
        },
        floatingPosterContainer: {
            position: "absolute",
            top: -100,
            left: padding.pageHorizontal,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        },
        floatingPoster: {
            width: 125,
            height: 187.5,
            borderRadius: 8,
            overflow: "hidden",
        },
        floatingTagline: {
            left: padding.pageHorizontal + 125,
            top: -10,
            width: "60%",
            height: 70,
            justifyContent: "center",
        },
        pageContent: {
            marginTop: 20,
        },
        list: {
            marginTop: padding.large,
        },
        section: {
            marginTop: padding.large,
        },
        linksContainer: {
            marginTop: padding.large,
            justifyContent: "center",
            flexDirection: "row",
            gap: padding.regular,
        },
        reviewCard: {
            height: 120,
        },
    });
