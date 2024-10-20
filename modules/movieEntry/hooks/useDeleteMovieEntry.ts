import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type MovieEntry, watchlistId } from "../models";
import {
    type DeleteMovieEntryRequest,
    type DeleteMovieEntryResponse,
    MovieEntriesService,
} from "../services";
import { MovieEntryKeys } from "./keys";

type Context = { previousEntries?: MovieEntry[]; previousEntry?: MovieEntry };

export const useDeleteMovieEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteMovieEntryResponse | null,
        unknown,
        Omit<DeleteMovieEntryRequest, "watchlistId">,
        Context
    >({
        mutationKey: MovieEntryKeys.mutate,
        mutationFn: (params) =>
            MovieEntriesService.deleteMovieEntry({
                ...params,
                watchlistId,
                session,
            }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieEntryKeys.listEntries(watchlistId),
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries = queryClient.getQueryData<MovieEntry[]>(
                MovieEntryKeys.listEntries(watchlistId),
            );

            const previousEntry = queryClient.getQueryData<MovieEntry>(
                MovieEntryKeys.listEntry(watchlistId, params.movieId),
            );

            // Optimistically delete the entry
            queryClient.setQueryData(
                MovieEntryKeys.listEntries(watchlistId),
                previousEntries?.filter(
                    ({ movieId }) => movieId !== params.movieId,
                ),
            );

            queryClient.setQueryData(
                MovieEntryKeys.listEntry(watchlistId, params.movieId),
                null,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntries, previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<MovieEntry[]>(
                MovieEntryKeys.listEntries(watchlistId),
                context.previousEntries,
            );

            queryClient.setQueryData<MovieEntry>(
                MovieEntryKeys.listEntry(watchlistId, params.movieId),
                context.previousEntry,
            );
        },
    });
};
