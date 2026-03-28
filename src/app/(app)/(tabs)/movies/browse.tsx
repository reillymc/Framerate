import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { Poster, ScreenLayout } from "@/components";
import { usePosterDimensions } from "@/hooks";
import { usePopularMovies } from "@/modules/movie";
import {
    useDeleteMovieWatchlistEntry,
    useMovieWatchlist,
    useSaveMovieWatchlistEntry,
} from "@/modules/movieWatchlist";

const Browse: FC = () => {
    const router = useRouter();
    const { data: movies } = usePopularMovies();
    const { data: watchlist } = useMovieWatchlist();
    const { mutate: saveEntry } = useSaveMovieWatchlistEntry();
    const { mutate: deleteEntry } = useDeleteMovieWatchlistEntry();

    const { displayCount, configuration } = usePosterDimensions({
        size: "medium",
    });

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
                key={displayCount}
                numColumns={displayCount}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const onWatchlist = watchlist?.entries?.some(
                        ({ movieId }) => movieId === item.id,
                    );

                    return (
                        <Link
                            href={{
                                pathname: "/movies/movie",
                                params: {
                                    id: item.id,
                                    title: item.title,
                                    posterPath: item.posterPath,
                                },
                            }}
                            asChild
                        >
                            <Link.Menu title={item.title}>
                                <Link.MenuAction
                                    title="Add Watch"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/movies/editWatch",
                                            params: { movieId: item.id },
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
                                            ? deleteEntry({ movieId: item.id })
                                            : saveEntry({ movieId: item.id })
                                    }
                                    icon={onWatchlist ? "eye.slash" : "eye"}
                                />
                            </Link.Menu>
                            <Link.Trigger>
                                <Poster
                                    key={item.id}
                                    heading={item.title}
                                    {...configuration}
                                    asLink
                                    imageUri={item.posterPath}
                                />
                            </Link.Trigger>
                            <Link.Preview />
                        </Link>
                    );
                }}
            />
        </ScreenLayout>
    );
};

export default Browse;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: spacing.medium,
            paddingBottom: spacing.large,
        },
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
    });
