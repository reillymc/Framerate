import { PosterCard, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import { MediaType } from "@/constants/mediaTypes";
import {
    usePopularMovies,
    useRecentSearches,
    useSearchMovies,
} from "@/modules/movie";
import { useMovieReviews } from "@/modules/movieReview";
import { ReviewSummaryCard } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";
import { WatchlistEntriesChart, WatchlistSummary } from "@/modules/watchlist";
import {
    useDeleteWatchlistEntry,
    useSaveWatchlistEntry,
    useWatchlistEntries,
} from "@/modules/watchlistEntry";
import {
    IconAction,
    IconActionV2,
    SwipeAction,
    SwipeView,
    Text,
    type ThemedStyles,
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import { type FC, useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    LinearTransition,
    ZoomInLeft,
    ZoomOutLeft,
} from "react-native-reanimated";
import type { SearchBarCommands } from "react-native-screens";

const Movies: FC = () => {
    const router = useRouter();
    const { data: reviews } = useMovieReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width: posterWidth, gap: posterGap } = usePosterDimensions({
        size: "large",
    });

    const { configuration } = useCurrentUserConfig();

    const searchRef = useRef<SearchBarCommands>(null);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const { data: results } = useSearchMovies(searchValue);
    const { data: popularMovies } = usePopularMovies();
    const { data: watchlistEntries = [] } = useWatchlistEntries("movie");
    const { mutate: saveWatchlistEntry } = useSaveWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();
    const { recentSearches, addSearch, deleteSearch } = useRecentSearches();

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const filteredPopularMovies = useMemo(() => {
        const excludedMediaIds = [
            ...watchlistEntries.map(({ mediaId }) => mediaId),
            ...reviewList.map(({ movie }) => movie.id),
        ];

        return popularMovies?.filter(
            ({ id }) => !excludedMediaIds.includes(id),
        );
    }, [popularMovies, watchlistEntries, reviewList]);

    const handlePressDate = useCallback(
        (date?: Date) =>
            router.navigate({
                pathname: "/movies/watchlist",
                params: { jumpToDate: date?.toISOString() },
            }),
        [router],
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Movies",
                    headerSearchBarOptions: {
                        onChangeText: ({ nativeEvent }) =>
                            setSearchValue(nativeEvent.text),
                        placeholder: "Search movies",
                        hideWhenScrolling: false,
                        barTintColor: theme.color.inputBackground,
                        tintColor: theme.color.primary,
                        onFocus: () => setIsSearching(true),
                        onCancelButtonPress: () => setIsSearching(false),
                        ref: searchRef,
                        onSearchButtonPress: ({ nativeEvent }) =>
                            addSearch({ searchValue: nativeEvent.text }),
                    },
                    headerRight: () => (
                        <IconActionV2
                            iconName="person"
                            onPress={() =>
                                router.push({ pathname: "/profile" })
                            }
                        />
                    ),
                }}
            />
            {isSearching && !!searchValue && (
                <FlatList
                    data={results}
                    contentContainerStyle={styles.searchList}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item }) => {
                        const onWatchlist = watchlistEntries.some(
                            ({ mediaId }) => mediaId === item.id,
                        );

                        return (
                            <PosterCard
                                heading={item.title}
                                releaseDate={
                                    item.releaseDate
                                        ? new Date(item.releaseDate)
                                              .getFullYear()
                                              .toString()
                                        : "Unknown"
                                }
                                imageUri={item.posterPath}
                                onWatchlist={onWatchlist}
                                onPress={() => {
                                    router.push({
                                        pathname: "/movies/movie",
                                        params: {
                                            mediaId: item.id,
                                            mediaTitle: item.title,
                                            mediaPosterUri: item.posterPath,
                                        },
                                    });
                                    addSearch({ searchValue: item.title });
                                }}
                                onAddReview={() =>
                                    router.push({
                                        pathname: "/movies/editReview",
                                        params: { movieId: item.id },
                                    })
                                }
                                onToggleWatchlist={() =>
                                    onWatchlist
                                        ? deleteWatchlistEntry({
                                              mediaId: item.id,
                                              mediaType: MediaType.Movie,
                                          })
                                        : saveWatchlistEntry({
                                              mediaId: item.id,
                                              mediaType: MediaType.Movie,
                                          })
                                }
                            />
                        );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                />
            )}
            {isSearching && !searchValue && (
                <FlatList
                    data={recentSearches}
                    contentContainerStyle={styles.searchList}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item, index }) => (
                        <SwipeView
                            rightActions={[
                                <SwipeAction
                                    key="delete"
                                    variant="destructive"
                                    iconName="close"
                                    onPress={() => deleteSearch(index)}
                                />,
                            ]}
                        >
                            <Pressable
                                onPress={() => {
                                    searchRef.current?.setText(
                                        item.searchValue,
                                    );
                                    setSearchValue(item.searchValue);
                                    addSearch(item);
                                }}
                                style={[
                                    styles.searchSuggestion,
                                    index === recentSearches.length - 1 && {
                                        borderBottomWidth: 0,
                                    },
                                ]}
                            >
                                <Text>{item.searchValue}</Text>
                            </Pressable>
                        </SwipeView>
                    )}
                    keyExtractor={(item) => item.searchValue}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                />
            )}
            {!isSearching && (
                <FlatList
                    contentInsetAdjustmentBehavior="automatic"
                    ListHeaderComponent={
                        <>
                            <SectionHeading
                                title="Watchlist"
                                style={styles.pageElement}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/movies/watchlist",
                                    })
                                }
                            />
                            <View style={styles.watchlistSectionContainer}>
                                <Animated.View
                                    entering={ZoomInLeft.springify().mass(0.55)}
                                    exiting={ZoomOutLeft.springify().mass(0.55)}
                                    layout={LinearTransition}
                                    style={styles.watchlistSectionItem}
                                >
                                    <WatchlistSummary
                                        watchlistEntries={watchlistEntries}
                                        onPressEntry={(item) =>
                                            router.push({
                                                pathname: "/movies/movie",
                                                params: {
                                                    id: item.mediaId,
                                                    title: item.mediaTitle,
                                                    posterPath:
                                                        item.mediaPosterUri,
                                                },
                                            })
                                        }
                                        onPress={handlePressDate}
                                        onAddReview={({ mediaId }) =>
                                            router.push({
                                                pathname: "/movies/editReview",
                                                params: { movieId: mediaId },
                                            })
                                        }
                                        onRemoveFromWatchlist={({ mediaId }) =>
                                            deleteWatchlistEntry({
                                                mediaId,
                                                mediaType: "movie",
                                            })
                                        }
                                    />
                                </Animated.View>
                                <WatchlistEntriesChart
                                    style={[
                                        styles.watchlistSectionItem,
                                        styles.watchlistChart,
                                    ]}
                                    entries={watchlistEntries}
                                    onPressDate={handlePressDate}
                                />
                            </View>
                            <SectionHeading
                                title="Popular"
                                style={styles.pageElement}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/movies/browse",
                                    })
                                }
                            />
                            <FlatList
                                data={filteredPopularMovies}
                                horizontal
                                contentContainerStyle={[
                                    styles.pageElement,
                                    styles.moviesList,
                                ]}
                                snapToAlignment="start"
                                showsHorizontalScrollIndicator={false}
                                decelerationRate="fast"
                                snapToInterval={posterWidth + posterGap}
                                renderItem={({ item }) => {
                                    const onWatchlist = watchlistEntries.some(
                                        ({ mediaId }) => mediaId === item.id,
                                    );

                                    return (
                                        <Poster
                                            key={item.id}
                                            heading={item.title}
                                            imageUri={item.posterPath}
                                            size="large"
                                            onWatchlist={onWatchlist}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/movies/movie",
                                                    params: {
                                                        id: item.id,
                                                        title: item.title,
                                                        posterPath:
                                                            item.posterPath,
                                                    },
                                                })
                                            }
                                            onAddReview={() =>
                                                router.push({
                                                    pathname:
                                                        "/movies/editReview",
                                                    params: {
                                                        movieId: item.id,
                                                    },
                                                })
                                            }
                                            onToggleWatchlist={() =>
                                                onWatchlist
                                                    ? deleteWatchlistEntry({
                                                          mediaId: item.id,
                                                          mediaType: "movie",
                                                      })
                                                    : saveWatchlistEntry({
                                                          mediaId: item.id,
                                                          mediaType: "movie",
                                                      })
                                            }
                                        />
                                    );
                                }}
                            />
                            <SectionHeading
                                title="My Reviews"
                                style={styles.pageElement}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/movies/reviews",
                                    })
                                }
                            />
                        </>
                    }
                    data={reviewList}
                    CellRendererComponent={({
                        children,
                        cellKey,
                        onLayout,
                    }) => (
                        <View
                            key={cellKey}
                            onLayout={onLayout}
                            style={styles.pageElement}
                        >
                            {children}
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <ReviewSummaryCard
                            key={item.reviewId}
                            review={item}
                            mediaTitle={item.movie.title}
                            mediaDate={item.movie.releaseDate}
                            mediaPosterPath={item.movie.posterPath}
                            starCount={configuration.ratings.starCount}
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/movie",
                                    params: {
                                        id: item.movie.id,
                                        title: item.movie.title,
                                        posterPath: item.movie.posterPath,
                                    },
                                })
                            }
                            onOpenReview={() =>
                                router.push({
                                    pathname: "/movies/review",
                                    params: { reviewId: item.reviewId },
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.reviewsEmptyMessage}>
                            Nothing here yet. To save a review, search or pick a
                            movie then 'Add Review'
                        </Text>
                    }
                    ListFooterComponent={
                        reviewList.length ? (
                            <IconAction
                                containerStyle={styles.reviewFooter}
                                iconName="right"
                                labelPosition="left"
                                size="small"
                                label="All"
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/movies/reviews",
                                    })
                                }
                            />
                        ) : null
                    }
                />
            )}
        </>
    );
};

export default Movies;

const createStyles = ({ theme: { padding, color } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
        watchlistSectionContainer: {
            flexDirection: "row",
        },
        watchlistSectionItem: {
            width: "50%",
        },
        watchlistChart: {
            flex: 1,
            height: 171,
            paddingTop: padding.tiny,
            marginRight: padding.pageHorizontal,
        },
        moviesList: {
            marginBottom: padding.small,
            paddingTop: padding.tiny,
        },
        reviewFooter: {
            alignSelf: "flex-end",
            paddingHorizontal: padding.pageHorizontal,
            marginBottom: padding.pageBottom,
        },
        reviewsEmptyMessage: {
            paddingHorizontal: padding.pageHorizontal,
            marginBottom: padding.pageBottom,
        },
        searchList: {
            paddingTop: padding.small,
        },
        searchSuggestion: {
            marginLeft: padding.pageHorizontal,
            paddingVertical: padding.regular,
            borderBottomWidth: 1,
            borderBottomColor: `${color.border}44`,
            backgroundColor: color.background,
        },
    });
