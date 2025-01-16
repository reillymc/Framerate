import { ScreenLayout } from "@/components";
import { Poster } from "@/components/poster";
import { usePopularMovies } from "@/modules/movie";
import {
    useDeleteMovieWatchlistEntry,
    useMovieWatchlist,
    useSaveMovieWatchlistEntry,
} from "@/modules/movieWatchlist";

import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Browse: FC = () => {
    const router = useRouter();
    const { data: movies } = usePopularMovies();
    const { data: watchlist } = useMovieWatchlist();
    const { mutate: saveEntry } = useSaveMovieWatchlistEntry();
    const { mutate: deleteEntry } = useDeleteMovieWatchlistEntry();

    const styles = useThemedStyles(createStyles, {});

    return (
        <ScreenLayout
            meta={<Stack.Screen options={{ title: "Popular Movies" }} />}
        >
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
                    const onWatchlist = watchlist?.entries?.some(
                        ({ movieId }) => movieId === item.id,
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
                                    pathname: "/movies/editWatch",
                                    params: { movieId: item.id },
                                })
                            }
                            onToggleWatchlist={() =>
                                onWatchlist
                                    ? deleteEntry({ movieId: item.id })
                                    : saveEntry({ movieId: item.id })
                            }
                        />
                    );
                }}
            />
        </ScreenLayout>
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
