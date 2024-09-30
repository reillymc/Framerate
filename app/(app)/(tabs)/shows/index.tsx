import { PosterCard, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import { MediaType } from "@/constants/mediaTypes";
import { ReviewSummaryCard, useInfiniteReviews } from "@/modules/review";
import {
    usePopularShows,
    useRecentSearches,
    useSearchShows,
} from "@/modules/show";
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
import { Stack, router } from "expo-router";
import { type FC, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import type { SearchBarCommands } from "react-native-screens";

const Shows: FC = () => {
    const { data: reviews } = useInfiniteReviews({
        mediaType: MediaType.Show,
        page: 1,
    });

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width: posterWidth, gap: posterGap } = usePosterDimensions({
        size: "large",
    });

    const searchRef = useRef<SearchBarCommands>(null);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const { data: results } = useSearchShows(searchValue);
    const { data: popularShows } = usePopularShows();
    const { data: watchlistEntries = [] } = useWatchlistEntries("show");
    const { mutate: saveWatchlistEntry } = useSaveWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();
    const { recentSearches, addSearch, deleteSearch } = useRecentSearches();

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const filteredPopularShows = useMemo(() => {
        const excludedMediaIds = [
            ...watchlistEntries.map(({ mediaId }) => mediaId),
            ...reviewList.map(({ mediaId }) => mediaId),
        ];

        return popularShows?.filter(({ id }) => !excludedMediaIds.includes(id));
    }, [popularShows, watchlistEntries, reviewList]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Shows",
                    headerSearchBarOptions: {
                        onChangeText: ({ nativeEvent }) =>
                            setSearchValue(nativeEvent.text),
                        placeholder: "Search shows",
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
                                heading={item.name}
                                releaseDate={
                                    item.firstAirDate
                                        ? new Date(item.firstAirDate)
                                              .getFullYear()
                                              .toString()
                                        : "Unknown"
                                }
                                imageUri={item.posterPath}
                                onWatchlist={onWatchlist}
                                onPress={() => {
                                    router.push({
                                        pathname: "/shows/show",
                                        params: {
                                            mediaId: item.id,
                                            mediaTitle: item.name,
                                            mediaPosterUri: item.posterPath,
                                        },
                                    });
                                    addSearch({ searchValue: item.name });
                                }}
                                onAddReview={() =>
                                    router.push({
                                        pathname: "/shows/editReview",
                                        params: {
                                            mediaId: item.id,
                                            mediaTitle: item.name,
                                            mediaPosterUri: item.posterPath,
                                        },
                                    })
                                }
                                onToggleWatchlist={() =>
                                    onWatchlist
                                        ? deleteWatchlistEntry({
                                              mediaId: item.id,
                                              mediaType: "show",
                                          })
                                        : saveWatchlistEntry({
                                              mediaId: item.id,
                                              mediaType: "show",
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
                                        pathname: "/shows/watchlist",
                                    })
                                }
                            />
                            <Text style={styles.pageElement}>
                                {watchlistEntries.length} shows in your
                                watchlist
                            </Text>
                            <SectionHeading
                                title="Popular"
                                style={styles.pageElement}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/shows/browse",
                                    })
                                }
                            />
                            <FlatList
                                data={filteredPopularShows}
                                horizontal
                                contentContainerStyle={[
                                    styles.pageElement,
                                    styles.showsList,
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
                                            heading={item.name}
                                            imageUri={item.posterPath}
                                            size="large"
                                            onWatchlist={onWatchlist}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/shows/show",
                                                    params: {
                                                        mediaId: item.id,
                                                        mediaTitle: item.name,
                                                        mediaPosterUri:
                                                            item.posterPath,
                                                    },
                                                })
                                            }
                                            onAddReview={() =>
                                                router.push({
                                                    pathname:
                                                        "/shows/editReview",
                                                    params: {
                                                        mediaId: item.id,
                                                        mediaTitle: item.name,
                                                        mediaPosterUri:
                                                            item.posterPath,
                                                    },
                                                })
                                            }
                                            onToggleWatchlist={() =>
                                                onWatchlist
                                                    ? deleteWatchlistEntry({
                                                          mediaId: item.id,
                                                          mediaType: "show",
                                                      })
                                                    : saveWatchlistEntry({
                                                          mediaId: item.id,
                                                          mediaType: "show",
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
                                        pathname: "/shows/reviews",
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
                            onPress={() =>
                                router.push({
                                    pathname: "/shows/show",
                                    params: {
                                        mediaId: item.mediaId,
                                        mediaTitle: item.mediaTitle,
                                        mediaPosterUri: item.mediaPosterUri,
                                    },
                                })
                            }
                            onOpenReview={() =>
                                router.push({
                                    pathname: "/shows/review",
                                    params: { reviewId: item.reviewId },
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.reviewsEmptyMessage}>
                            Nothing here yet. To save a review, search or pick a
                            show then 'Add Review'
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
                                        pathname: "/shows/reviews",
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

export default Shows;

const createStyles = ({ theme: { padding, color } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
        showsList: {
            marginBottom: padding.small,
            paddingTop: padding.tiny,
        },
        reviewFooter: {
            alignSelf: "flex-end",
            paddingHorizontal: padding.pageHorizontal,
            marginBottom: padding.large,
        },
        reviewsEmptyMessage: {
            paddingHorizontal: padding.pageHorizontal,
            marginBottom: 64,
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
