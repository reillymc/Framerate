import { PosterCard, SectionHeading } from "@/components";
import { Poster, usePosterDimensions } from "@/components/poster";
import {
    usePopularShows,
    useRecentSearches,
    useSearchShows,
} from "@/modules/show";
import {} from "@/modules/watchlist";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import {
    IconActionV2,
    SwipeAction,
    SwipeView,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { type FC, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import {} from "react-native-reanimated";
import type { SearchBarCommands } from "react-native-screens";

const Shows: FC = () => {
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
    const { recentSearches, addSearch, deleteSearch } = useRecentSearches();

    const filteredPopularShows = useMemo(() => {
        const excludedMediaIds = [
            ...watchlistEntries.map(({ mediaId }) => mediaId),
        ];

        return popularShows?.filter(({ id }) => !excludedMediaIds.includes(id));
    }, [popularShows, watchlistEntries]);

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
                                        />
                                    );
                                }}
                            />
                            <SectionHeading
                                title="My Reviews"
                                style={styles.pageElement}
                            />
                        </>
                    }
                    data={[]}
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
                    renderItem={() => null}
                    ListEmptyComponent={
                        <Text style={styles.reviewsEmptyMessage}>
                            Nothing here yet. To save a review, search or pick a
                            show then 'Add Review'
                        </Text>
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
