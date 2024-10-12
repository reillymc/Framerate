import { Poster } from "@/components/poster";
import { usePopularMovies } from "@/modules/movie";
import {
    useDeleteWatchlistEntry,
    useSaveWatchlistEntry,
    useWatchlistEntries,
} from "@/modules/watchlistEntry";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Browse: FC = () => {
    const { data: movies } = usePopularMovies();
    const { data: watchlistEntries = [] } = useWatchlistEntries("movie");
    const { mutate: saveWatchlistEntry } = useSaveWatchlistEntry();
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Popular Movies",
                }}
            />
            <FlatList
                data={movies}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.list}
                CellRendererComponent={({ children, cellKey, onLayout }) => (
                    <View
                        key={cellKey}
                        onLayout={onLayout}
                        style={styles.pageElement}
                    >
                        {children}
                    </View>
                )}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const onWatchlist = watchlistEntries.some(
                        ({ mediaId }) => mediaId === item.id,
                    );

                    return (
                        <Poster
                            key={item.id}
                            heading={item.title}
                            size="medium"
                            imageUri={item.posterPath}
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
                                    params: { movieId: item.id },
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
        </>
    );
};

export default Browse;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: padding.regular,
            paddingBottom: padding.large,
        },
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
    });
