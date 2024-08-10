import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type DeleteWatchlistEntryParams,
    WatchlistEntriesService,
    type WatchlistEntryDetails,
} from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useDeleteWatchlistEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<null>,
        unknown,
        DeleteWatchlistEntryParams,
        { previousEntry?: WatchlistEntryDetails }
    >({
        mutationKey: WatchlistEntryKeys.mutate,
        mutationFn: WatchlistEntriesService.deleteWatchlistEntry,
        onSuccess: (_response, params) => {
            queryClient.invalidateQueries({
                queryKey: WatchlistEntryKeys.listEntries(params.mediaType),
            });
        },
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntry =
                queryClient.getQueryData<WatchlistEntryDetails>(
                    WatchlistEntryKeys.listEntry(
                        params.mediaType,
                        params.mediaId,
                    ),
                );

            // Optimistically delete the entry
            queryClient.setQueryData(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                null,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<WatchlistEntryDetails>(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                context.previousEntry,
            );
        },
    });
};
