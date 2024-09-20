import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type DeleteWatchlistEntryRequest,
    type DeleteWatchlistEntryResponse,
    WatchlistEntriesService,
    type WatchlistEntryDetails,
    type WatchlistEntrySummary,
} from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useDeleteWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteWatchlistEntryResponse | null,
        unknown,
        DeleteWatchlistEntryRequest,
        {
            previousEntries?: WatchlistEntrySummary[];
            previousEntry?: WatchlistEntryDetails;
        }
    >({
        mutationKey: WatchlistEntryKeys.mutate,
        mutationFn: (params) =>
            WatchlistEntriesService.deleteWatchlistEntry({
                ...params,
                session,
            }),
        onSuccess: (_response, params) => {
            queryClient.invalidateQueries({
                queryKey: WatchlistEntryKeys.listEntries(params.mediaType),
            });
        },
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries = queryClient.getQueryData<
                WatchlistEntrySummary[]
            >(WatchlistEntryKeys.listEntries(params.mediaType));

            const previousEntry =
                queryClient.getQueryData<WatchlistEntryDetails>(
                    WatchlistEntryKeys.listEntry(
                        params.mediaType,
                        params.mediaId,
                    ),
                );

            // Optimistically delete the entry
            queryClient.setQueryData(
                WatchlistEntryKeys.listEntries(params.mediaType),
                previousEntries?.filter(
                    ({ mediaId }) => mediaId !== params.mediaId,
                ),
            );

            queryClient.setQueryData(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                null,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntries, previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<WatchlistEntrySummary[]>(
                WatchlistEntryKeys.listEntries(params.mediaType),
                context.previousEntries,
            );

            queryClient.setQueryData<WatchlistEntryDetails>(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                context.previousEntry,
            );
        },
    });
};
