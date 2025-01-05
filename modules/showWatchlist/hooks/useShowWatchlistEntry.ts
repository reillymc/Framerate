import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowWatchlist } from "../models";
import { ShowWatchlistService } from "../services";
import { ShowWatchlistKeys } from "./keys";

export const useShowWatchlistEntry = (showId: number | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ShowWatchlistKeys.entry(showId),
        enabled: !!showId,
        queryFn: () =>
            ShowWatchlistService.getEntry({
                // biome-ignore lint/style/noNonNullAssertion: showId is guaranteed to be defined by the enabled flag
                showId: showId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowWatchlist>(["show", "watchlist"])
                ?.entries?.find((d) => d.showId === showId),
    });
};
