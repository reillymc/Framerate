import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Watchlist, WatchlistsService } from "../services";

export const useWatchlist = (mediaType: string | undefined) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["watchlists", mediaType],
        enabled: !!mediaType,
        queryFn: () =>
            // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
            WatchlistsService.getWatchlist({ mediaType: mediaType! }),
        placeholderData: () =>
            queryClient
                .getQueryData<Watchlist[]>(["watchlists"])
                ?.find((d) => d.mediaType === mediaType),
    });
};
