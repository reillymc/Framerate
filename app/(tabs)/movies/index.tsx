import { SectionHeading, TmdbImage } from "@/components";
import { Poster } from "@/components/poster";
import { MediaType } from "@/constants/mediaTypes";
import { usePopularMovies, useSearch } from "@/hooks";
import { useReviews } from "@/modules/review";
import { WatchlistSummary } from "@/modules/watchlist";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import {
    IconActionV2,
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";

export default function HomeScreen() {
    const { data: reviews } = useReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const [searchValue, setSearchValue] = useState("");
    const { data: results } = useSearch({ searchValue });
    const { data: popularMovies } = usePopularMovies();
    const { data: watchlistEntries } = useWatchlistEntries("movie");

    const posterItemWidth =
        (width - theme.padding.pageHorizontal * 2) * (2 / 3) +
        theme.padding.pageHorizontal / 2;

    const filteredPopularMovies = useMemo(
        () =>
            popularMovies?.filter(
                (movie) =>
                    !watchlistEntries?.some(
                        ({ mediaId }) => mediaId === movie.mediaId,
                    ),
            ),
        [popularMovies, watchlistEntries],
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
                        hideNavigationBar: false,
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
                        <ListItem
                            header={
                                <Text>{`${item.title} (${item.year ?? "unknown"})`}</Text>
                            }
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/movie",
                                    params: { mediaId: item.mediaId },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.mediaId.toString()}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.pageElement}
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
                            <WatchlistSummary
                                watchlistEntries={watchlistEntries ?? []}
                                onPressEntry={(item) =>
                                    router.push({
                                        pathname: "/movies/movie",
                                        params: {
                                            mediaId: item.mediaId,
                                            mediaTitle: item.mediaTitle,
                                            mediaPosterUri: item.mediaPosterUri,
                                        },
                                    })
                                }
                            />
                            <SectionHeading
                                title="Popular"
                                style={styles.pageElement}
                            />
                            <FlatList
                                data={filteredPopularMovies}
                                horizontal
                                contentContainerStyle={[
                                    styles.pageElement,
                                    { height: posterItemWidth * (3 / 2) + 60 },
                                ]}
                                snapToAlignment="start"
                                showsHorizontalScrollIndicator={false}
                                decelerationRate="fast"
                                snapToInterval={posterItemWidth}
                                renderItem={({ item }) => (
                                    <Poster
                                        key={item.mediaId}
                                        heading={item.title}
                                        imageUri={item.poster}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/movies/movie",
                                                params: {
                                                    mediaId: item.mediaId,
                                                    mediaTitle: item.title,
                                                    mediaPosterUri: item.poster,
                                                },
                                            })
                                        }
                                    />
                                )}
                            />
                            <SectionHeading
                                title="My Reviews"
                                style={styles.pageElement}
                            />
                        </>
                    }
                    data={reviews}
                    CellRendererComponent={({ children }) => (
                        <View style={styles.pageElement}>{children}</View>
                    )}
                    renderItem={({ item }) => (
                        <ListItem
                            key={item.reviewId}
                            style={styles.reviewCard}
                            heading={`${item.mediaTitle} (${item.mediaReleaseYear})`}
                            avatar={
                                <TmdbImage
                                    type="poster"
                                    path={item.mediaPosterUri}
                                    style={{ width: 80, height: "100%" }}
                                />
                            }
                            contentRows={[
                                <ListItemRow
                                    key="details"
                                    contentItems={
                                        item.date
                                            ? [
                                                  <Text key="date">
                                                      {new Date(
                                                          item.date,
                                                      ).toDateString()}
                                                  </Text>,
                                              ]
                                            : undefined
                                    }
                                />,
                            ]}
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
        reviewCard: {
            height: 120,
        },
    });
