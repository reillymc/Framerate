import { placeholderUserId } from "@/constants/placeholderUser";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieDetails } from "@/modules/movie/services";
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

            const movieDetails = queryClient.getQueryData<MovieDetails>(
                MovieKeys.details(params.mediaId),
            );

            // Optimistically update to the new value
            queryClient.setQueryData<WatchlistEntryDetails>(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                {
                    ...movieDetails,
                    ...params,
                    mediaTitle: movieDetails?.title ?? "",
                    userId: placeholderUserId,
                    watchlistId: params.mediaType,
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
