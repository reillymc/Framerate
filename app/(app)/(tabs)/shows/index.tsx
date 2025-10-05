import { type FC, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import type { SearchBarCommands } from "react-native-screens";
import { Stack, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { Undefined } from "@reillymc/es-utils";
import {
    IconAction,
    IconButton,
    Tag,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ReviewSummaryCard } from "@/modules/review";
import {
    usePopularShows,
    useRecentShowSearches,
    useSearchShows,
} from "@/modules/show";
import { useShowCollections } from "@/modules/showCollection";
import { useShowReviews } from "@/modules/showReview";
import {
    ShowUpNextList,
    useDeleteShowWatchlistEntry,
    useSaveShowWatchlistEntry,
    useShowWatchlist,
} from "@/modules/showWatchlist";
import { useCurrentUserConfig } from "@/modules/user";

import {
    HeaderIconAction,
    Poster,
    PosterCard,
    RecentSearchList,
    ResponsiveFlatList,
    SectionHeading,
    usePosterDimensions,
} from "@/components";
import { displayYear } from "@/helpers/dateHelper";

const Shows: FC = () => {
    const { data: reviews } = useShowReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const browsePoster = usePosterDimensions({
        size: "medium",
        teaseSpacing: true,
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
    const { recentSearches, addSearch, deleteSearch } = useRecentShowSearches();
    const { data: collections = [] } = useShowCollections();

    const reviewList = reviews?.pages.flat().filter(Undefined) ?? [];

    const excludedMediaIds = [
        ...(watchlist?.entries?.map(({ showId }) => showId) ?? []),
        ...reviewList.map(({ show }) => show.id),
    ];

    const filteredPopularShows = popularShows?.filter(
        ({ id }) => !excludedMediaIds.includes(id),
    );

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
                        <HeaderIconAction
                            iconSet={Octicons}
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
                                        pathname: "/shows/editWatch",
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
                <RecentSearchList
                    recentSearches={recentSearches}
                    onDeleteSearchItem={deleteSearch}
                    onPressSearchItem={(item) => {
                        searchRef.current?.setText(item.searchValue);
                        setSearchValue(item.searchValue);
                        addSearch(item);
                    }}
                />
            )}
            {!isSearching && (
                <ResponsiveFlatList
                    contentInsetAdjustmentBehavior="automatic"
                    minColumnWidth={380}
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
                            <ShowUpNextList
                                watchlist={watchlist}
                                onPressShow={({ name, showId, posterPath }) =>
                                    router.push({
                                        pathname: "/shows/show",
                                        params: {
                                            id: showId,
                                            name,
                                            posterPath,
                                        },
                                    })
                                }
                            />
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
                                snapToInterval={browsePoster.interval}
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
                                            {...browsePoster.configuration}
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
                                                        "/shows/editWatch",
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
                                title="Collections"
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
                                        pathname: "/shows/watches",
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
                                    pathname: "/shows/watch",
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
                                iconSet={Octicons}
                                containerStyle={styles.reviewFooter}
                                iconName="chevron-right"
                                iconPosition="right"
                                label="All"
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/shows/watches",
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

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        showsList: {
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
