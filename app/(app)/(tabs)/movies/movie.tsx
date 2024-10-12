import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import {
    Text,
    type ThemedStyles,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    MediaFooterButtons,
    MediaLinks,
    ParallaxScrollView,
    Poster,
    TmdbImage,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useMovie } from "@/modules/movie";
import { useMovieReviews } from "@/modules/movieReview";
import { ReviewDetailsCard, ReviewRatingTimeline } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";
import {
    useDeleteWatchlistEntry,
    useSaveWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import { useMemo } from "react";

const Movie: React.FC = () => {
    const {
        id: idParam,
        title,
        posterPath,
    } = useLocalSearchParams<{
        id: string;
        title?: string;
        posterPath?: string;
    }>();

    const movieId = Number.parseInt(idParam ?? "", 10);

    const { data: movie } = useMovie(movieId);
    const { configuration } = useCurrentUserConfig();
    const { data: reviews, refetch } = useMovieReviews({ movieId });
    const { data: watchlistEntry } = useWatchlistEntry(
        MediaType.Movie,
        movieId,
    );
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();
    const { mutate: saveWatchlistEntry } = useSaveWatchlistEntry();

    const router = useRouter();

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const releaseDate = movie?.releaseDate
        ? new Date(movie.releaseDate).toLocaleString("default", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : undefined;

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen options={{ title: movie?.title ?? title }} />
            <ParallaxScrollView
                headerImage={
                    <TmdbImage type="backdrop" path={movie?.backdropPath} />
                }
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
                scrollIndicatorInsets={{ top: 330, bottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
            >
                <Poster
                    style={styles.floatingPoster}
                    size="small"
                    removeMargin
                    imageUri={movie?.posterPath ?? posterPath}
                />
                <View style={styles.floatingTagline}>
                    <Text variant="heading" numberOfLines={3}>
                        {movie?.tagline}
                    </Text>
                </View>
                <View style={styles.pageContent}>
                    <Text variant="body">{movie?.overview}</Text>
                    {releaseDate && (
                        <Text variant="bodyEmphasized" style={styles.section}>
                            {`Release Date: ${releaseDate}`}
                        </Text>
                    )}

                    {!!reviewList?.length && (
                        <>
                            <Text variant="title" style={styles.section}>
                                Reviews
                            </Text>
                            {reviewList.length > 1 && (
                                <ReviewRatingTimeline
                                    reviews={reviewList}
                                    starCount={configuration.ratings.starCount}
                                />
                            )}
                            <FlatList
                                contentInsetAdjustmentBehavior="automatic"
                                scrollEnabled={false}
                                data={reviewList}
                                renderItem={({ item }) => (
                                    <ReviewDetailsCard
                                        key={item.reviewId}
                                        starCount={
                                            configuration.ratings.starCount
                                        }
                                        review={item}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/movies/review",
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
                <MediaLinks
                    mediaType={MediaType.Movie}
                    tmdbId={movie?.id}
                    imdbId={movie?.imdbId}
                />
            </ParallaxScrollView>
            <MediaFooterButtons
                onWatchlist={!!watchlistEntry}
                onAddReview={() =>
                    router.push({
                        pathname: "/movies/editReview",
                        params: { movieId },
                    })
                }
                onToggleWatchlist={() => {
                    if (watchlistEntry) {
                        deleteWatchlistEntry({
                            mediaId: movieId,
                            mediaType: MediaType.Movie,
                        });
                        return;
                    }

                    if (!movie) return;

                    saveWatchlistEntry({
                        mediaId: movieId,
                        mediaType: MediaType.Movie,
                    });
                }}
            />
        </>
    );
};

export default Movie;

const createStyles = ({ theme: { color, padding, border } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.pageBottom,
            backgroundColor: color.background,
            borderRadius: border.radius.loose,
        },
        floatingPoster: {
            position: "absolute",
            top: -95,
            left: padding.pageHorizontal + padding.small,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
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
    });
