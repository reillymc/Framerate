import { PosterCard, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import { displayYear } from "@/helpers/dateHelper";
import { ReviewSummaryCard } from "@/modules/review";
import {
    usePopularShows,
    useRecentSearches,
    useSearchShows,
} from "@/modules/show";
import { useShowCollections } from "@/modules/showCollection";
import { useShowReviews } from "@/modules/showReview";
import {
    useDeleteShowWatchlistEntry,
    useSaveShowWatchlistEntry,
    useShowWatchlist,
} from "@/modules/showWatchlist";
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
import { type FC, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import type { SearchBarCommands } from "react-native-screens";

const Shows: FC = () => {
    const { data: reviews } = useShowReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width: posterWidth, gap: posterGap } = usePosterDimensions({
        size: "large",
    });

    const router = useRouter();

    const { configuration } = useCurrentUserConfig();

    const searchRef = useRef<SearchBarCommands>(null);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const { data: results } = useSearchShows(searchValue);
    const { data: popularShows } = usePopularShows();
    const { data: watchlist } = useShowWatchlist();
    const { mutate: saveWatchlistEntry } = useSaveShowWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteShowWatchlistEntry();
    const { recentSearches, addSearch, deleteSearch } = useRecentSearches();
    const { data: collections = [] } = useShowCollections();

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const filteredPopularShows = useMemo(() => {
        const excludedMediaIds = [
            ...(watchlist?.entries?.map(({ showId }) => showId) ?? []),
            ...reviewList.map(({ show }) => show.id),
        ];

        return popularShows?.filter(({ id }) => !excludedMediaIds.includes(id));
    }, [popularShows, watchlist?.entries, reviewList]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Shows",
                    headerSearchBarOptions: {
                        ref: searchRef,
                        placeholder: "Search shows",
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
            {isSearching && !!searchValue && (
                <FlatList
                    data={results}
                    contentContainerStyle={styles.searchList}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item }) => {
                        const onWatchlist = watchlist?.entries?.some(
                            ({ showId }) => showId === item.id,
                        );

                        return (
                            <PosterCard
                                heading={item.name}
                                subHeading={displayYear(item.firstAirDate)}
                                imageUri={item.posterPath}
                                onWatchlist={onWatchlist}
                                onPress={() => {
                                    router.push({
                                        pathname: "/shows/show",
                                        params: {
                                            id: item.id,
                                            name: item.name,
                                            posterPath: item.posterPath,
                                        },
                                    });
                                    addSearch({ searchValue: item.name });
                                }}
                                onAddReview={() =>
                                    router.push({
                                        pathname: "/shows/editReview",
                                        params: { showId: item.id },
                                    })
                                }
                                onToggleWatchlist={() =>
                                    onWatchlist
                                        ? deleteWatchlistEntry({
                                              showId: item.id,
                                          })
                                        : saveWatchlistEntry({
                                              showId: item.id,
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
                                {watchlist?.entries?.length ?? 0} shows in your
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
                                    const onWatchlist =
                                        watchlist?.entries?.some(
                                            ({ showId }) => showId === item.id,
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
                                                        id: item.id,
                                                        name: item.name,
                                                        posterPath:
                                                            item.posterPath,
                                                    },
                                                })
                                            }
                                            onAddReview={() =>
                                                router.push({
                                                    pathname:
                                                        "/shows/editReview",
                                                    params: { showId: item.id },
                                                })
                                            }
                                            onToggleWatchlist={() =>
                                                onWatchlist
                                                    ? deleteWatchlistEntry({
                                                          showId: item.id,
                                                      })
                                                    : saveWatchlistEntry({
                                                          showId: item.id,
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
                                        pathname: "/shows/collections",
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
                                                pathname: "/shows/collection",
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
                            mediaTitle={item.show.name}
                            mediaDate={item.show.firstAirDate}
                            mediaPosterPath={item.show.posterPath}
                            starCount={configuration.ratings.starCount}
                            onPress={() =>
                                router.push({
                                    pathname: "/shows/show",
                                    params: {
                                        id: item.show.id,
                                        name: item.show.name,
                                        posterPath: item.show.posterPath,
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
                            Nothing here yet. To log a watch or save a review,
                            search or pick a show then 'Add Watch'
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
