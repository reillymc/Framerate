import { type FC, useCallback, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Platform,
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
import { Stack, useRouter } from "expo-router";
import {
    IconAction,
    IconActionV2,
    Tag,
    Text,
    type ThemedStyles,
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    usePopularMovies,
    useRecentMovieSearches,
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
    Poster,
    PosterCard,
    RecentSearchList,
    ResponsiveFlatList,
    ScreenLayout,
    ScreenSection,
    SectionHeading,
    usePosterDimensions,
} from "@/components";
import { displayYear } from "@/helpers/dateHelper";

const Movies: FC = () => {
    const router = useRouter();
    const { data: reviews } = useMovieReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const browsePoster = usePosterDimensions({
        size: "large",
        teaseSpacing: true,
    });
    const watchlistPoster = usePosterDimensions({ size: "small" });

    const { configuration } = useCurrentUserConfig();

    const searchRef = useRef<SearchBarCommands>(null);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const { data: results } = useSearchMovies(searchValue);
    const { data: popularMovies } = usePopularMovies();
    const { data: watchlist } = useMovieWatchlist();
    const { mutate: saveWatchlistEntry } = useSaveMovieWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteMovieWatchlistEntry();
    const { recentSearches, addSearch, deleteSearch } =
        useRecentMovieSearches();
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
                                    subHeading={displayYear(item.releaseDate)}
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
                                            pathname: "/movies/editWatch",
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
                    <RecentSearchList
                        recentSearches={recentSearches}
                        onDeleteSearchItem={deleteSearch}
                        onPressSearchItem={(item) => {
                            searchRef.current?.setText(item.searchValue);
                            setSearchValue(item.searchValue);
                            addSearch(item);
                        }}
                    />
                )
            }
        >
            <ResponsiveFlatList
                contentInsetAdjustmentBehavior="automatic"
                minColumnWidth={380}
                ListHeaderComponent={
                    <>
                        <ScreenSection
                            title="Watchlist"
                            onPress={() =>
                                router.navigate({
                                    pathname: "/movies/watchlist",
                                })
                            }
                        >
                            <View style={styles.watchlistSectionContainer}>
                                <Animated.View
                                    entering={ZoomInLeft.springify().mass(0.55)}
                                    exiting={ZoomOutLeft.springify().mass(0.55)}
                                    layout={LinearTransition}
                                    style={styles.watchlistSectionItem}
                                >
                                    <MovieEntriesSummary
                                        posterProperties={watchlistPoster}
                                        watchlistEntries={
                                            watchlist?.entries ?? []
                                        }
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
                                                pathname: "/movies/editWatch",
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
                        </ScreenSection>
                        <ScreenSection
                            title="Popular"
                            onPress={() =>
                                router.navigate({
                                    pathname: "/movies/browse",
                                })
                            }
                        >
                            <FlatList
                                data={filteredPopularMovies}
                                horizontal
                                contentContainerStyle={[
                                    styles.pageElement,
                                    styles.moviesList,
                                ]}
                                snapToAlignment="start"
                                showsHorizontalScrollIndicator={
                                    Platform.OS === "web"
                                }
                                scrollIndicatorInsets={{ left: 20, right: 20 }}
                                decelerationRate="fast"
                                snapToInterval={browsePoster.interval}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => {
                                    const onWatchlist =
                                        watchlist?.entries?.some(
                                            ({ movieId }) =>
                                                movieId === item.id,
                                        );

                                    return (
                                        <Poster
                                            key={item.id}
                                            heading={item.title}
                                            imageUri={item.posterPath}
                                            {...browsePoster.configuration}
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
                                                        "/movies/editWatch",
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
                        </ScreenSection>
                        <ScreenSection
                            title="Collections"
                            onPress={() =>
                                router.navigate({
                                    pathname: "/movies/collections",
                                })
                            }
                        >
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
                        </ScreenSection>
                        <SectionHeading
                            title="My Watches"
                            style={styles.pageElement}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/movies/watches",
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
                                pathname: "/movies/watch",
                                params: { reviewId: item.reviewId },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.reviewsEmptyMessage}>
                        Nothing here yet. To log a watch search or pick a movie
                        then 'Add Watch'
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
                                    pathname: "/movies/watches",
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

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        watchlistSectionContainer: {
            flexDirection: "row",
            marginRight: spacing.pageHorizontal,
        },
        watchlistSectionItem: {
            width: "50%",
        },
        watchlistChart: {
            flex: 1,
            paddingTop: spacing.tiny,
            paddingBottom: spacing.large - spacing.tiny,
        },
        moviesList: {
            marginBottom: spacing.small,
            paddingTop: spacing.tiny,
        },
        reviewFooter: {
            alignSelf: "flex-end",
            paddingHorizontal: spacing.pageHorizontal,
            marginBottom: spacing.pageBottom,
        },
        reviewsEmptyMessage: {
            paddingHorizontal: spacing.pageHorizontal,
            marginBottom: spacing.pageBottom,
        },
        searchList: {
            paddingTop: spacing.small,
            paddingBottom: spacing.pageBottom,
        },
        collectionsList: {
            paddingHorizontal: spacing.pageHorizontal,
            marginBottom: spacing.medium,
        },
    });
