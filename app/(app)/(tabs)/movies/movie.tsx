import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import {
    IconAction,
    Tag,
    Text,
    type ThemedStyles,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    ContextMenu,
    MediaFooterButtons,
    MediaLinks,
    ParallaxScrollView,
    Poster,
    TmdbImage,
    usePosterDimensions,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useMovie } from "@/modules/movie";

import {
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

    const movieId = idParam ? Number.parseInt(idParam, 10) : undefined;
    const { width: posterWidth, gap: posterGap } = usePosterDimensions({
        size: "small",
    });

    const { data: movie } = useMovie(movieId);
    const { configuration } = useCurrentUserConfig();
    const { data: reviews, refetch } = useMovieReviews({ movieId });
    const { data: watchlistEntry } = useMovieWatchlistEntry(movieId);
    const { mutate: deleteWatchlistEntry } = useDeleteMovieWatchlistEntry();
    const { mutate: saveWatchlistEntry } = useSaveMovieWatchlistEntry();
    const { mutate: saveCollectionEntry } = useSaveMovieCollectionEntry();
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
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.collections}
                >
                    {collectionsContainingMovie?.map(
                        ({ name, collectionId }) => (
                            <Tag
                                key={collectionId}
                                label={name}
                                variant="light"
                            />
                        ),
                    )}
                    {!!collectionsNotContainingMovie?.length && (
                        <ContextMenu
                            menuConfig={{
                                menuTitle: "Select Collection",
                                menuItems: collectionsNotContainingMovie.map(
                                    ({ collectionId, name }) => ({
                                        actionKey: collectionId,
                                        actionTitle: name,
                                    }),
                                ),
                            }}
                            onPressMenuAction={({ actionKey }) => {
                                if (!movie) return;
                                saveCollectionEntry({
                                    collectionId: actionKey,
                                    movieId: movie.id,
                                });
                                return;
                            }}
                        >
                            <IconAction
                                iconName="book"
                                label="Save to collection"
                            />
                        </ContextMenu>
                    )}
                </ScrollView>
                <View style={styles.pageContent}>
                    <Text variant="body">{movie?.overview}</Text>
                    {director && (
                        <Text variant="bodyEmphasized" style={styles.section}>
                            {`Directed by: ${director}`}
                        </Text>
                    )}
                    {screenwriter && (
                        <Text variant="bodyEmphasized" style={styles.section}>
                            {`Screenplay by: ${screenwriter}`}
                        </Text>
                    )}

                    {releaseDate && (
                        <Text variant="bodyEmphasized" style={styles.section}>
                            {`Release Date: ${releaseDate}`}
                        </Text>
                    )}

                    {!!reviewList?.length && (
                        <>
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
                                        starCount={
                                            configuration.ratings.starCount
                                        }
                                        review={item}
                                        hideTimeline={
                                            index === reviewList.length - 1
                                        }
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
                            snapToInterval={posterWidth + posterGap}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Poster
                                    key={item.id}
                                    imageUri={item.profilePath}
                                    heading={item.name}
                                    subHeading={item.character}
                                    size="small"
                                />
                            )}
                        />
                    </>
                )}
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
                    if (!movieId) return;

                    if (watchlistEntry) {
                        deleteWatchlistEntry({ movieId });
                        return;
                    }

                    saveWatchlistEntry({ movieId });
                }}
            />
        </>
    );
};

export default Movie;

const createStyles = ({ theme: { color, padding, border } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
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
            left: padding.pageHorizontal + 140,
            top: -10,
            width: "60%",
            height: 70,
            justifyContent: "center",
        },
        collections: {
            paddingTop: padding.regular,
            paddingHorizontal: padding.pageHorizontal,
            alignItems: "center",
        },
        pageContent: {
            marginTop: 20,
            paddingHorizontal: padding.pageHorizontal,
        },
        list: {
            marginTop: padding.large,
        },
        section: {
            marginTop: padding.large,
        },
        castList: {
            marginTop: padding.regular,
            paddingHorizontal: padding.pageHorizontal,
        },
        sectionHeading: {
            marginTop: padding.regular,
            paddingHorizontal: padding.pageHorizontal,
        },
    });
