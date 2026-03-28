import type { FC } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
    SectionedMovieEntryList,
    useDeleteMovieWatchlistEntry,
    useMovieWatchlist,
} from "@/modules/movieWatchlist";

import { EmptyState, ScreenLayout } from "@/components";

const Watchlist: FC = () => {
    const { jumpToDate } = useLocalSearchParams<{ jumpToDate?: string }>();

    const router = useRouter();
    const { data: watchlist, isLoading, refetch } = useMovieWatchlist();
    const { mutate: deleteEntry } = useDeleteMovieWatchlistEntry();

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: watchlist?.name ?? "Loading...",
                        scrollEdgeEffects: {
                            top: "hard",
                        },
                    }}
                />
            }
            isLoading={isLoading}
            isEmpty={!watchlist?.entries?.length}
            empty={<EmptyState heading="No movies on watchlist" />}
            loading={<EmptyState heading="Loading..." />}
        >
            <SectionedMovieEntryList
                entries={watchlist?.entries ?? []}
                jumpToDate={jumpToDate ? new Date(jumpToDate) : undefined}
                onRefresh={refetch}
                onDeleteEntry={(movieId) => deleteEntry({ movieId })}
                renderItem={({ item, children }) => (
                    <Link
                        href={{
                            pathname: "/movies/movie",
                            params: {
                                id: item.movieId,
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
                                        params: {
                                            movieId: item.movieId,
                                        },
                                    })
                                }
                                icon="plus"
                            />
                            <Link.MenuAction
                                title="Remove from Watchlist"
                                onPress={() =>
                                    deleteEntry({
                                        movieId: item.movieId,
                                    })
                                }
                                icon="eye.slash"
                            />
                        </Link.Menu>
                        <Link.Trigger>{children}</Link.Trigger>
                        <Link.Preview />
                    </Link>
                )}
            />
        </ScreenLayout>
    );
};

export default Watchlist;
