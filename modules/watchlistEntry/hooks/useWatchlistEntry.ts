import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    WatchlistEntriesService,
    type WatchlistEntrySummary,
} from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useWatchlistEntry = (
    mediaType: string | undefined,
    mediaId: number | undefined,
) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: WatchlistEntryKeys.listEntry(mediaType, mediaId),
        enabled: !!mediaType && !!mediaId,
        queryFn: () =>
            WatchlistEntriesService.getWatchlistEntry({
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaType: mediaType!,
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaId: mediaId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<WatchlistEntrySummary[]>(
                    WatchlistEntryKeys.listEntries(mediaType),
                )
                ?.find((d) => d.mediaId === mediaId),
    });
};
