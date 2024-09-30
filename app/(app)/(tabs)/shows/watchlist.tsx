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
    const { data: watchlist } = useWatchlist(MediaType.Show);
    const {
        data: entries = [],
        isLoading,
        refetch,
    } = useWatchlistEntries(MediaType.Show);
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
                            pathname: "/shows/show",
                            params: {
                                mediaId: item.mediaId,
                                mediaTitle: item.mediaTitle,
                                mediaPosterUri: item.mediaPosterUri,
                            },
                        })
                    }
                    onDeleteEntry={(mediaId) =>
                        deleteWatchlistEntry({
                            mediaId,
                            mediaType: MediaType.Show,
                        })
                    }
                />
            )}
        </>
    );
};

export default Watchlist;
