import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { WatchlistsService } from "../services";

export const useWatchlist = (watchlistId: string | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ["watchlists", watchlistId],
        enabled: !!watchlistId,
        queryFn: () =>
            WatchlistsService.getWatchlist({
                // biome-ignore lint/style/noNonNullAssertion: watchlistId is guaranteed to be defined by the enabled flag
                watchlistId: watchlistId!,
                session,
            }),
    });
};
