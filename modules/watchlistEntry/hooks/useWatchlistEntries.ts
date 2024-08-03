import { useQuery } from "@tanstack/react-query";
import { WatchlistEntriesService } from "../services";

export const useWatchlistEntries = (mediaType: string | undefined) => {
    return useQuery({
        queryKey: ["watchlistEntries", mediaType],
        enabled: !!mediaType,

        queryFn: () =>
            WatchlistEntriesService.getWatchlistEntries({
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaType: mediaType!,
            }),
    });
};
