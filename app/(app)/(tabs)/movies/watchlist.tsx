import { MediaType } from "@/constants/mediaTypes";
import { SectionedWatchlist, useWatchlist } from "@/modules/watchlist";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntries,
} from "@/modules/watchlistEntry";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";

const Watchlist: FC = () => {
    const { jumpToDate } = useLocalSearchParams<{ jumpToDate?: string }>();

    const router = useRouter();
    const { data: watchlist } = useWatchlist(MediaType.Movie);
    const {
        data: entries = [],
        isLoading,
        refetch,
    } = useWatchlistEntries(MediaType.Movie);
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && (
                <SectionedWatchlist
                    entries={entries}
                    jumpToDate={jumpToDate ? new Date(jumpToDate) : undefined}
                    onRefresh={refetch}
                    onPressEntry={(item) =>
                        router.push({
                            pathname: "/movies/movie",
                            params: {
                                id: item.mediaId,
                                title: item.mediaTitle,
                                posterPath: item.mediaPosterUri,
                            },
                        })
                    }
                    onDeleteEntry={(mediaId) =>
                        deleteWatchlistEntry({
                            mediaId,
                            mediaType: MediaType.Movie,
                        })
                    }
                />
            )}
        </>
    );
};

export default Watchlist;
