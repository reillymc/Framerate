import type { FC } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

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
                        headerBlurEffect: "regular",
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
                onPressEntry={(item) =>
                    router.push({
                        pathname: "/movies/movie",
                        params: {
                            id: item.movieId,
                            title: item.title,
                            posterPath: item.posterPath,
                        },
                    })
                }
                onAddReview={(movieId) =>
                    router.push({
                        pathname: "/movies/editWatch",
                        params: { movieId },
                    })
                }
                onDeleteEntry={(movieId) => deleteEntry({ movieId })}
            />
        </ScreenLayout>
    );
};

export default Watchlist;
