import { MediaType } from "@/constants/mediaTypes";
import { useDeleteShowEntry, useShowEntries } from "@/modules/showEntry";
import { useWatchlist } from "@/modules/watchlist";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";

const Watchlist: FC = () => {
    const { jumpToDate } = useLocalSearchParams<{ jumpToDate?: string }>();

    const router = useRouter();
    const { data: watchlist } = useWatchlist(MediaType.Show);
    const { data: entries = [], isLoading, refetch } = useShowEntries();
    const { mutate: deleteWatchlistEntry } = useDeleteShowEntry();

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && <></>}
        </>
    );
};

export default Watchlist;
