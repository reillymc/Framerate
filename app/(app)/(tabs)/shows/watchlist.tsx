import { MediaType } from "@/constants/mediaTypes";
import {
    SectionedShowEntryList,
    useDeleteShowEntry,
    useShowEntries,
} from "@/modules/showEntry";
import { useWatchlist } from "@/modules/watchlist";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";

const Watchlist: FC = () => {
    const router = useRouter();
    const { data: watchlist } = useWatchlist(MediaType.Show);
    const { data: entries = [], isLoading, refetch } = useShowEntries();
    const { mutate: deleteWatchlistEntry } = useDeleteShowEntry();

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && (
                <SectionedShowEntryList
                    entries={entries}
                    onDeleteEntry={(showId) => deleteWatchlistEntry({ showId })}
                    onPressEntry={(item) =>
                        router.push({
                            pathname: "/shows/show",
                            params: {
                                id: item.showId,
                                name: item.name,
                                posterPath: item.posterPath,
                            },
                        })
                    }
                    onRefresh={refetch}
                />
            )}
        </>
    );
};

export default Watchlist;
