import { useSession } from "@/modules/auth";
import type { MovieEntry } from "@/modules/movieCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist } from "../models";
import {
    type DeleteEntryRequest,
    type DeleteEntryResponse,
    MovieWatchlistService,
} from "../services";
import { MovieWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: MovieWatchlist;
    previousEntry?: MovieEntry;
};

export const useDeleteMovieWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteEntryResponse | null,
        unknown,
        DeleteEntryRequest,
        Context
    >({
        mutationFn: (params) =>
            MovieWatchlistService.deleteEntry({ session, ...params }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieWatchlistKeys.base,
            }),
        onMutate: ({ movieId }) => {
            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData<MovieWatchlist>(
                MovieWatchlistKeys.base,
            );

            const previousEntry = queryClient.getQueryData<MovieEntry>(
                MovieWatchlistKeys.entry(movieId),
            );

            // Optimistically delete the entry
            if (previousWatchlist?.entries) {
                queryClient.setQueryData<MovieWatchlist>(
                    MovieWatchlistKeys.base,
                    {
                        ...previousWatchlist,
                        entries: previousWatchlist.entries.filter(
                            (movie) => movie.movieId !== movieId,
                        ),
                    },
                );
            }

            queryClient.setQueryData(MovieWatchlistKeys.entry(movieId), null);

            // Return snapshot so we can rollback in case of failure
            return { previousWatchlist, previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<MovieWatchlist>(
                MovieWatchlistKeys.base,
                context.previousWatchlist,
            );

            queryClient.setQueryData<MovieEntry>(
                MovieWatchlistKeys.entry(params.movieId),
                context.previousEntry,
            );
        },
    });
};
