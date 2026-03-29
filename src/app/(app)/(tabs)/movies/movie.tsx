import { type FC, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Undefined } from "@reillymc/es-utils";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    MediaHeaderButtons,
    MediaLinks,
    ParallaxScrollView,
    Poster,
    ScreenLayout,
    TmdbImage,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { usePosterDimensions } from "@/hooks";
import { CollectionAssociationList } from "@/modules/collection";
import { useClientConfig } from "@/modules/meta";
import { useMovie } from "@/modules/movie";
import {
    useDeleteMovieCollectionEntry,
    useFilteredMovieCollections,
    useSaveMovieCollectionEntry,
} from "@/modules/movieCollection";
import { useMovieReviews } from "@/modules/movieReview";
import {
    useDeleteMovieWatchlistEntry,
    useMovieWatchlistEntry,
    useSaveMovieWatchlistEntry,
} from "@/modules/movieWatchlist";
import { RatingHistoryChart, ReviewTimelineItem } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";

const Movie: FC = () => {
    const { id: idParam, posterPath } = useLocalSearchParams<{
        id: string;
        posterPath?: string;
    }>();

    const movieId = idParam ? Number.parseInt(idParam, 10) : undefined;
    const heroPoster = usePosterDimensions({
        size: "small",
    });
    const castPoster = usePosterDimensions({
        size: "small",
        teaseSpacing: true,
    });

    const { data: movie } = useMovie(movieId);
    const { configuration } = useCurrentUserConfig();
    const { data: clientConfig } = useClientConfig();
    const { data: reviews } = useMovieReviews({ movieId });
    const { data: watchlistEntry } = useMovieWatchlistEntry(movieId);
    const { mutate: deleteWatchlistEntry } = useDeleteMovieWatchlistEntry();
    const { mutate: saveWatchlistEntry } = useSaveMovieWatchlistEntry();
    const { mutate: saveCollectionEntry } = useSaveMovieCollectionEntry();
    const { mutate: removeCollectionEntry } = useDeleteMovieCollectionEntry();
    const { collectionsContainingMovie, collectionsNotContainingMovie } =
        useFilteredMovieCollections(movieId);
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

    const director = movie?.credits?.crew
        .filter((crew) => crew.job === "Director")
        .map((crew) => crew.name)
        .join(", ");

    const screenwriter = movie?.credits?.crew
        .filter((crew) => crew.job === "Screenplay")
        .map((crew) => crew.name)
        .join(", ");

    const styles = useThemedStyles(createStyles, {
        posterWidth: heroPoster.interval,
        posterHeight: heroPoster.height,
    });

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: "",
                        headerRight: () => (
                            <MediaHeaderButtons
                                onWatchlist={!!watchlistEntry}
                                onAddReview={() =>
                                    router.push({
                                        pathname: "/movies/editWatch",
                                        params: { movieId },
                                    })
                                }
                                onToggleWatchlist={() => {
                                    if (!movieId) return;

                                    if (watchlistEntry) {
                                        deleteWatchlistEntry({ movieId });
                                        return;
                                    }

                                    saveWatchlistEntry({ movieId });
                                }}
                            />
                        ),
                    }}
                />
            }
        >
            <ParallaxScrollView
                headerImage={
                    <TmdbImage type="backdrop" path={movie?.backdropPath} />
                }
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
                scrollIndicatorInsets={{ top: 330 }}
            >
                <Link.AppleZoomTarget>
                    <Poster
                        style={styles.floatingPoster}
                        size="small"
                        removeMargin
                        imageUri={movie?.posterPath ?? posterPath}
                    />
                </Link.AppleZoomTarget>
                <View style={styles.floatingTagline}>
                    <Text variant="heading" numberOfLines={3}>
                        {movie?.tagline}
                    </Text>
                </View>
                <View style={styles.detailContent}>
                    <Text variant="body">{movie?.overview}</Text>
                    {!!director && (
                        <Text
                            variant="body"
                            style={[styles.section, styles.emphasis]}
                        >
                            {`Directed by: ${director}`}
                        </Text>
                    )}
                    {!!screenwriter && (
                        <Text
                            variant="body"
                            style={[styles.section, styles.emphasis]}
                        >
                            {`Screenplay by: ${screenwriter}`}
                        </Text>
                    )}

                    {!!releaseDate && (
                        <Text
                            variant="body"
                            style={[styles.section, styles.emphasis]}
                        >
                            {`Release Date: ${releaseDate}`}
                        </Text>
                    )}
                </View>
                <CollectionAssociationList
                    associatedCollections={collectionsContainingMovie}
                    unassociatedCollections={collectionsNotContainingMovie}
                    onSaveToCollection={(collectionId) => {
                        if (!movieId) return;
                        saveCollectionEntry({ collectionId, movieId });
                    }}
                    onRemoveFromCollection={(collectionId) => {
                        if (!movieId) return;
                        removeCollectionEntry({ collectionId, movieId });
                    }}
                />
                {!!reviewList?.length && (
                    <View style={styles.detailContent}>
                        <Text variant="title" style={styles.section}>
                            Watch History
                        </Text>
                        <RatingHistoryChart
                            reviews={reviewList}
                            starCount={configuration.ratings.starCount}
                        />
                        <FlatList
                            contentInsetAdjustmentBehavior="automatic"
                            scrollEnabled={false}
                            data={reviewList}
                            renderItem={({ item, index }) => (
                                <ReviewTimelineItem
                                    key={item.reviewId}
                                    starCount={configuration.ratings.starCount}
                                    review={item}
                                    hideTimeline={
                                        index === reviewList.length - 1
                                    }
                                    onPress={() =>
                                        router.push({
                                            pathname: "/movies/watch",
                                            params: {
                                                reviewId: item.reviewId,
                                            },
                                        })
                                    }
                                />
                            )}
                            contentContainerStyle={styles.list}
                        />
                    </View>
                )}
                {!!movie?.credits?.cast.length && (
                    <>
                        <Text variant="title" style={styles.sectionHeading}>
                            Cast
                        </Text>
                        <FlatList
                            horizontal
                            data={movie.credits.cast}
                            contentContainerStyle={styles.castList}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            snapToInterval={castPoster.interval}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Poster
                                    key={item.id}
                                    imageUri={item.profilePath}
                                    heading={item.name}
                                    subHeading={item.character}
                                    {...castPoster.configuration}
                                />
                            )}
                        />
                    </>
                )}
                <MediaLinks
                    mediaExternalLinks={clientConfig?.mediaExternalLinks}
                    mediaType={MediaType.Movie}
                    tmdbId={movie?.id}
                    imdbId={movie?.imdbId}
                />
            </ParallaxScrollView>
        </ScreenLayout>
    );
};

export default Movie;

const createStyles = (
    { theme: { color, spacing, border } }: ThemedStyles,
    {
        posterWidth,
        posterHeight,
    }: { posterWidth: number; posterHeight: number },
) =>
    StyleSheet.create({
        container: {
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom,
            backgroundColor: color.background,
            borderRadius: border.radius.loose,
        },
        floatingPoster: {
            position: "absolute",
            top: -(posterHeight / (7 / 4)),
            left: spacing.pageHorizontal + spacing.small,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        },
        floatingTagline: {
            left: spacing.pageHorizontal + posterWidth + spacing.medium,
            top: -spacing.small,
            width: "60%",
            height: 70,
            justifyContent: "center",
        },
        collections: {
            paddingTop: posterHeight * (1 / 4),
            paddingHorizontal: spacing.pageHorizontal,
            alignItems: "center",
        },
        detailContent: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        list: {
            marginTop: spacing.large,
        },
        section: {
            marginTop: spacing.large,
        },
        castList: {
            marginTop: spacing.medium,
            paddingHorizontal: spacing.pageHorizontal,
        },
        sectionHeading: {
            marginTop: spacing.medium,
            paddingHorizontal: spacing.pageHorizontal,
        },
        emphasis: {
            fontWeight: "600",
        },
    });
