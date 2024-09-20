import { useSession } from "@/modules/auth";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieDetails, MovieSearchResult } from "@/modules/movie/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type SaveWatchlistEntryRequest,
    type SaveWatchlistEntryResponse,
    WatchlistEntriesService,
    type WatchlistEntryDetails,
    type WatchlistEntrySummary,
} from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useSaveWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        SaveWatchlistEntryResponse | null,
        unknown,
        SaveWatchlistEntryRequest,
        {
            previousEntries?: WatchlistEntrySummary[];
            previousEntry?: WatchlistEntryDetails;
        }
    >({
        mutationKey: WatchlistEntryKeys.mutate,
        mutationFn: (params) =>
            WatchlistEntriesService.saveWatchlistEntry({ session, ...params }),
        onSuccess: (_response, params) => {
            queryClient.invalidateQueries({
                queryKey: WatchlistEntryKeys.listEntries(params.mediaType),
            });
        },
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries =
                queryClient.getQueryData<WatchlistEntrySummary[]>(
                    WatchlistEntryKeys.listEntries(params.mediaType),
                ) ?? [];

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

            const movieDetailsPopular = queryClient
                .getQueryData<MovieSearchResult[]>(MovieKeys.popular())
                ?.find(({ id }) => id === params.mediaId);

            const updatedEntry = {
                ...movieDetailsPopular,
                ...movieDetails,
                ...params,
                mediaTitle:
                    movieDetails?.title ?? movieDetailsPopular?.title ?? "",
                mediaReleaseDate:
                    movieDetails?.releaseDate ??
                    movieDetailsPopular?.releaseDate,
                mediaPosterUri:
                    movieDetails?.posterPath ?? movieDetailsPopular?.posterPath,
                watchlistId: params.mediaType,
            } satisfies WatchlistEntryDetails;

            // Optimistically update to the new value
            queryClient.setQueryData<WatchlistEntrySummary[]>(
                WatchlistEntryKeys.listEntries(params.mediaType),
                [updatedEntry, ...previousEntries].sort((a, b) =>
                    a.mediaReleaseDate && b.mediaReleaseDate
                        ? new Date(b.mediaReleaseDate).getTime() -
                          new Date(a.mediaReleaseDate).getTime()
                        : -1,
                ),
            );

            queryClient.setQueryData<WatchlistEntryDetails>(
                WatchlistEntryKeys.listEntry(params.mediaType, params.mediaId),
                updatedEntry,
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
