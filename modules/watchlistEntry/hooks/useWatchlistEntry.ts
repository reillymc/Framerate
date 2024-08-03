import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    WatchlistEntriesService,
    type WatchlistEntrySummary,
} from "../services";

export const useWatchlistEntry = (
    mediaType: string | undefined,
    mediaId: number | undefined,
) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["watchlistEntries", mediaType, mediaId],
        enabled: !!mediaType && !!mediaId,
        queryFn: () =>
            WatchlistEntriesService.getWatchlistEntry({
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaType: mediaType!,
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaId: mediaId!,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<WatchlistEntrySummary[]>([
                    "watchlistEntries",
                    mediaType,
                ])
                ?.find((d) => d.mediaType === mediaType),
    });
};
