import { PosterCard, ScreenLayout, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import {
    usePopularMovies,
    useRecentSearches,
    useSearchMovies,
} from "@/modules/movie";
import { useMovieCollections } from "@/modules/movieCollection";
import { useMovieReviews } from "@/modules/movieReview";
import {
    MovieEntriesChart,
    MovieEntriesSummary,
    useDeleteMovieWatchlistEntry,
    useMovieWatchlist,
    useSaveMovieWatchlistEntry,
} from "@/modules/movieWatchlist";
import { ReviewSummaryCard } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";
import {
    IconAction,
    IconActionV2,
    SwipeAction,
    SwipeView,
    Tag,
    Text,
    type ThemedStyles,
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import { type FC, useCallback, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
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
    const { data: watchlist } = useMovieWatchlist();
    const { mutate: saveWatchlistEntry } = useSaveMovieWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteMovieWatchlistEntry();
    const { recentSearches, addSearch, deleteSearch } = useRecentSearches();
    const { data: collections = [] } = useMovieCollections();

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const filteredPopularMovies = useMemo(() => {
        const excludedMediaIds = [
            ...(watchlist?.entries?.map(({ movieId }) => movieId) ?? []),
            ...reviewList.map(({ movie }) => movie.id),
        ];

        return popularMovies?.filter(
            ({ id }) => !excludedMediaIds.includes(id),
        );
    }, [popularMovies, watchlist?.entries, reviewList]);

    const handlePressDate = useCallback(
        (date?: Date) =>
            router.navigate({
                pathname: "/movies/watchlist",
                params: { jumpToDate: date?.toISOString() },
            }),
        [router],
    );

    return (
        <ScreenLayout
            isSearching={isSearching}
            meta={
                <Stack.Screen
                    options={{
                        title: "Movies",
                        headerSearchBarOptions: {
                            ref: searchRef,
                            placeholder: "Search movies",
                            hideWhenScrolling: false,
                            barTintColor: theme.color.inputBackground,
                            tintColor: theme.color.secondary,
                            onChangeText: ({ nativeEvent }) =>
                                setSearchValue(nativeEvent.text),
                            onFocus: () => setIsSearching(true),
                            onCancelButtonPress: () => setIsSearching(false),
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
            }
            search={
                searchValue ? (
                    <FlatList
                        data={results}
                        contentContainerStyle={styles.searchList}
                        keyboardDismissMode="on-drag"
                        renderItem={({ item }) => {
                            const onWatchlist = watchlist?.entries?.some(
                                ({ movieId }) => movieId === item.id,
                            );

                            return (
                                <PosterCard
                                    heading={item.title}
                                    subHeading={
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
                                                id: item.id,
                                                title: item.title,
                                                posterPath: item.posterPath,
                                            },
                                        });
                                        addSearch({
                                            searchValue: item.title,
                                        });
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
                                                  movieId: item.id,
                                              })
                                            : saveWatchlistEntry({
                                                  movieId: item.id,
                                              })
                                    }
                                />
                            );
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        contentInsetAdjustmentBehavior="always"
                        keyboardShouldPersistTaps="handled"
                    />
                ) : (
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
                )
            }
        >
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
                                <MovieEntriesSummary
                                    watchlistEntries={watchlist?.entries ?? []}
                                    onPressEntry={(item) =>
                                        router.push({
                                            pathname: "/movies/movie",
                                            params: {
                                                id: item.movieId,
                                                title: item.title,
                                                posterPath: item.posterPath,
                                            },
                                        })
                                    }
                                    onPress={handlePressDate}
                                    onAddReview={({ movieId }) =>
                                        router.push({
                                            pathname: "/movies/editReview",
                                            params: { movieId },
                                        })
                                    }
                                    onRemoveFromWatchlist={({ movieId }) =>
                                        deleteWatchlistEntry({ movieId })
                                    }
                                />
                            </Animated.View>
                            <MovieEntriesChart
                                style={[
                                    styles.watchlistSectionItem,
                                    styles.watchlistChart,
                                ]}
                                entries={watchlist?.entries ?? []}
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
                                const onWatchlist = watchlist?.entries?.some(
                                    ({ movieId }) => movieId === item.id,
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
                                                    posterPath: item.posterPath,
                                                },
                                            })
                                        }
                                        onAddReview={() =>
                                            router.push({
                                                pathname: "/movies/editReview",
                                                params: {
                                                    movieId: item.id,
                                                },
                                            })
                                        }
                                        onToggleWatchlist={() =>
                                            onWatchlist
                                                ? deleteWatchlistEntry({
                                                      movieId: item.id,
                                                  })
                                                : saveWatchlistEntry({
                                                      movieId: item.id,
                                                  })
                                        }
                                    />
                                );
                            }}
                        />
                        <SectionHeading
                            title="My Collections"
                            style={styles.pageElement}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/movies/collections",
                                })
                            }
                        />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.collectionsList}
                        >
                            {collections?.map(({ collectionId, name }) => (
                                <Pressable
                                    key={collectionId}
                                    onPress={() =>
                                        router.navigate({
                                            pathname: "/movies/collection",
                                            params: { collectionId },
                                        })
                                    }
                                >
                                    <Tag label={name} variant="light" />
                                </Pressable>
                            ))}
                        </ScrollView>
                        <SectionHeading
                            title="My Watches"
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
                CellRendererComponent={({ children, cellKey, onLayout }) => (
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
                        Nothing here yet. To log a watch or save a review,
                        search or pick a movie then 'Add Watch'
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
        </ScreenLayout>
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
            paddingBottom: padding.pageBottom,
        },
        searchSuggestion: {
            marginLeft: padding.pageHorizontal,
            paddingVertical: padding.regular,
            borderBottomWidth: 1,
            borderBottomColor: `${color.border}44`,
            backgroundColor: color.background,
        },
        collectionsList: {
            paddingHorizontal: padding.pageHorizontal,
            marginBottom: padding.regular,
        },
    });
