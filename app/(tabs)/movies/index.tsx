import { PosterCard, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import { MediaType } from "@/constants/mediaTypes";
import { usePopularMovies, useSearchMovies } from "@/modules/movie";
import { ReviewSummaryCard, useInfiniteReviews } from "@/modules/review";
import { WatchlistEntriesChart, WatchlistSummary } from "@/modules/watchlist";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import {
    IconActionV2,
    type ThemedStyles,
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
    const { data: reviews } = useInfiniteReviews({ page: 1 });

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width: posterWidth, gap: posterGap } = usePosterDimensions({
        size: "large",
    });

    const [searchValue, setSearchValue] = useState("");
    const { data: results } = useSearchMovies(searchValue);
    const { data: popularMovies } = usePopularMovies();
    const { data: watchlistEntries = [] } = useWatchlistEntries("movie");

    const filteredPopularMovies = useMemo(
        () =>
            popularMovies?.filter(
                (movie) =>
                    !watchlistEntries?.some(
                        ({ mediaId }) => mediaId === movie.id,
                    ),
            ),
        [popularMovies, watchlistEntries],
    );

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
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
            {searchValue ? (
                <FlatList
                    data={results}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item }) => (
                        <PosterCard
                            title={item.title}
                            releaseDate={
                                item.releaseDate
                                    ? new Date(item.releaseDate)
                                          .getFullYear()
                                          .toString()
                                    : "Unknown"
                            }
                            imageUri={item.posterPath}
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/movie",
                                    params: {
                                        mediaId: item.id,
                                        mediaTitle: item.title,
                                        mediaPosterUri: item.posterPath,
                                    },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                />
            ) : (
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
                                        params: { mediaType: MediaType.Movie },
                                    })
                                }
                            />
                            <View style={styles.watchlistSectionContainer}>
                                <WatchlistSummary
                                    watchlistEntries={watchlistEntries}
                                    style={styles.watchlistSectionItem}
                                    onPressEntry={(item) =>
                                        router.push({
                                            pathname: "/movies/movie",
                                            params: {
                                                mediaId: item.mediaId,
                                                mediaTitle: item.mediaTitle,
                                                mediaPosterUri:
                                                    item.mediaPosterUri,
                                            },
                                        })
                                    }
                                    onPress={() =>
                                        router.navigate({
                                            pathname: "/movies/watchlist",
                                            params: {
                                                mediaType: MediaType.Movie,
                                            },
                                        })
                                    }
                                />
                                <WatchlistEntriesChart
                                    style={[
                                        styles.watchlistSectionItem,
                                        styles.watchlistChart,
                                    ]}
                                    entries={watchlistEntries}
                                    onPressDate={(date) =>
                                        router.navigate({
                                            pathname: "/movies/watchlist",
                                            params: {
                                                mediaType: MediaType.Movie,
                                                date: date.toISOString(),
                                            },
                                        })
                                    }
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
                                renderItem={({ item }) => (
                                    <Poster
                                        key={item.id}
                                        heading={item.title}
                                        imageUri={item.posterPath}
                                        size="large"
                                        onPress={() =>
                                            router.push({
                                                pathname: "/movies/movie",
                                                params: {
                                                    mediaId: item.id,
                                                    mediaTitle: item.title,
                                                    mediaPosterUri:
                                                        item.posterPath,
                                                },
                                            })
                                        }
                                    />
                                )}
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
                    CellRendererComponent={({ children }) => (
                        <View style={styles.pageElement}>{children}</View>
                    )}
                    renderItem={({ item }) => (
                        <ReviewSummaryCard
                            key={item.reviewId}
                            review={item}
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/movie",
                                    params: {
                                        mediaId: item.mediaId,
                                        mediaTitle: item.mediaTitle,
                                        mediaPosterUri: item.mediaPosterUri,
                                    },
                                })
                            }
                            onPressMore={() =>
                                router.push({
                                    pathname: "/movies/review",
                                    params: { reviewId: item.reviewId },
                                })
                            }
                        />
                    )}
                />
            )}
        </>
    );
}

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
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
            height: 168,
            marginRight: padding.pageHorizontal,
        },
        moviesList: {
            marginBottom: padding.large,
        },
    });
