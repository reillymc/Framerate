import { MediaType } from "@/constants/mediaTypes";
import {
    SectionedMovieEntryList,
    useDeleteMovieEntry,
    useMovieEntries,
} from "@/modules/movieEntry";
import { useWatchlist } from "@/modules/watchlist";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";

const Watchlist: FC = () => {
    const { jumpToDate } = useLocalSearchParams<{ jumpToDate?: string }>();

    const router = useRouter();
    const { data: watchlist } = useWatchlist(MediaType.Movie);
    const { data: entries = [], isLoading, refetch } = useMovieEntries();
    const { mutate: deleteEntry } = useDeleteMovieEntry();

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && (
                <SectionedMovieEntryList
                    entries={entries}
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
                    onDeleteEntry={(movieId) => deleteEntry({ movieId })}
                />
            )}
        </>
    );
};

export default Watchlist;
