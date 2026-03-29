import { type FC, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import type { SearchBarCommands } from "react-native-screens";
import { Link, Stack, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { Undefined } from "@reillymc/es-utils";
import {
    IconAction,
    Tag,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    HeaderIconAction,
    Poster,
    PosterCard,
    RecentSearchList,
    ResponsiveFlatList,
    ScreenLayout,
    ScreenSection,
} from "@/components";
import { displayYear } from "@/helpers/dateHelper";
import { usePosterDimensions } from "@/hooks";
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
        <ScreenLayout
            isSearching={isSearching}
            meta={
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
            }
            search={
                searchValue ? (
                    <FlatList
                        data={results}
                        contentContainerStyle={styles.searchList}
                        keyboardDismissMode="on-drag"
                        renderItem={({ item }) => {
                            const onWatchlist = watchlist?.entries?.some(
                                ({ showId }) => showId === item.id,
                            );

                            return (
                                <Link
                                    href={{
                                        pathname: "/shows/show",
                                        params: {
                                            id: item.id,
                                            name: item.name,
                                            posterPath: item.posterPath,
                                        },
                                    }}
                                    onPress={() => {
                                        addSearch({
                                            searchValue: item.name,
                                        });
                                    }}
                                    asChild
                                >
                                    <Link.Menu title={item.name}>
                                        <Link.MenuAction
                                            title="Add Watch"
                                            onPress={() =>
                                                router.push({
                                                    pathname:
                                                        "/shows/editWatch",
                                                    params: { showId: item.id },
                                                })
                                            }
                                            icon="plus"
                                        />
                                        <Link.MenuAction
                                            title={
                                                onWatchlist
                                                    ? "Remove from Watchlist"
                                                    : "Add to Watchlist"
                                            }
                                            onPress={() =>
                                                onWatchlist
                                                    ? deleteWatchlistEntry({
                                                          showId: item.id,
                                                      })
                                                    : saveWatchlistEntry({
                                                          showId: item.id,
                                                      })
                                            }
                                            icon={
                                                onWatchlist
                                                    ? "eye.slash"
                                                    : "eye"
                                            }
                                        />
                                    </Link.Menu>
                                    <Link.Trigger>
                                        <PosterCard
                                            heading={item.name}
                                            subHeading={displayYear(
                                                item.firstAirDate,
                                            )}
                                            imageUri={item.posterPath}
                                            asLink
                                        />
                                    </Link.Trigger>
                                    <Link.Preview />
                                </Link>
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
                            href={{ pathname: "/shows/watchlist" }}
                        />
                        <ShowUpNextList
                            watchlist={watchlist}
                            onAddWatch={(entry) =>
                                router.navigate({
                                    pathname: "/shows/editWatch",
                                    params: {
                                        showId: entry.showId,
                                    },
                                })
                            }
                            onRemoveWatchlist={deleteWatchlistEntry}
                        />
                        <ScreenSection
                            title="Popular"
                            href={{ pathname: "/shows/browse" }}
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
                                const onWatchlist = watchlist?.entries?.some(
                                    ({ showId }) => showId === item.id,
                                );

                                return (
                                    <Link
                                        href={{
                                            pathname: "/shows/show",
                                            params: {
                                                id: item.id,
                                                name: item.name,
                                                posterPath: item.posterPath,
                                            },
                                        }}
                                        asChild
                                    >
                                        <Link.Menu title={item.name}>
                                            <Link.MenuAction
                                                title="Add Watch"
                                                onPress={() =>
                                                    router.push({
                                                        pathname:
                                                            "/shows/editWatch",
                                                        params: {
                                                            showId: item.id,
                                                        },
                                                    })
                                                }
                                                icon="plus"
                                            />
                                            <Link.MenuAction
                                                title={
                                                    onWatchlist
                                                        ? "Remove from Watchlist"
                                                        : "Add to Watchlist"
                                                }
                                                onPress={() =>
                                                    onWatchlist
                                                        ? deleteWatchlistEntry({
                                                              showId: item.id,
                                                          })
                                                        : saveWatchlistEntry({
                                                              showId: item.id,
                                                          })
                                                }
                                                icon={
                                                    onWatchlist
                                                        ? "eye.slash"
                                                        : "eye"
                                                }
                                            />
                                        </Link.Menu>
                                        <Link.Trigger>
                                            <Poster
                                                key={item.id}
                                                heading={item.name}
                                                imageUri={item.posterPath}
                                                {...browsePoster.configuration}
                                                asLink
                                            />
                                        </Link.Trigger>
                                        <Link.Preview />
                                    </Link>
                                );
                            }}
                        />
                        <ScreenSection
                            title="Collections"
                            href={{ pathname: "/shows/collections" }}
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
                        <ScreenSection
                            title="My Watches"
                            href={{ pathname: "/shows/watches" }}
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
                    <Link
                        key={item.reviewId}
                        href={{
                            pathname: "/shows/show",
                            params: {
                                id: item.show.id,
                                name: item.show.name,
                                posterPath: item.show.posterPath,
                            },
                        }}
                        asChild
                    >
                        <Link.Menu title={item.show.name}>
                            <Link.MenuAction
                                title="Open Watch"
                                onPress={() =>
                                    router.push({
                                        pathname: "/shows/watch",
                                        params: { reviewId: item.reviewId },
                                    })
                                }
                                icon="book"
                            />
                        </Link.Menu>
                        <Link.Trigger>
                            <ReviewSummaryCard
                                review={item}
                                mediaTitle={item.show.name}
                                mediaDate={item.show.firstAirDate}
                                mediaPosterPath={item.show.posterPath}
                                starCount={configuration.ratings.starCount}
                            />
                        </Link.Trigger>
                        <Link.Preview />
                    </Link>
                )}
                ListEmptyComponent={
                    <Text style={styles.reviewsEmptyMessage}>
                        Nothing here yet. To log a watch or save a review,
                        search or pick a show then 'Add Watch'
                    </Text>
                }
                ListFooterComponent={
                    reviewList.length ? (
                        <Link href={{ pathname: "/shows/watches" }} asChild>
                            <IconAction
                                iconSet={Octicons}
                                containerStyle={styles.reviewFooter}
                                iconName="chevron-right"
                                iconPosition="right"
                                label="All"
                            />
                        </Link>
                    ) : null
                }
            />
        </ScreenLayout>
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
