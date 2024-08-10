import { placeholderUserId } from "@/constants/placeholderUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type SaveWatchlistEntryParams,
    WatchlistEntriesService,
    type WatchlistEntryDetails,
} from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useSaveWatchlistEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<null>,
        unknown,
        SaveWatchlistEntryParams,
        { previousEntry?: WatchlistEntryDetails }
    >({
        mutationKey: WatchlistEntryKeys.mutate,
        mutationFn: WatchlistEntriesService.saveWatchlistEntry,
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

            // Optimistically update to the new value
            queryClient.setQueryData<WatchlistEntryDetails>(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                {
                    mediaId: params.mediaId,
                    mediaReleaseDate: params.mediaReleaseDate,
                    mediaTitle: params.mediaTitle,
                    mediaType: params.mediaType,
                    userId: placeholderUserId,
                    watchlistId: params.mediaType,
                    mediaPosterUri: params.mediaPosterUri,
                } satisfies WatchlistEntryDetails,
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
