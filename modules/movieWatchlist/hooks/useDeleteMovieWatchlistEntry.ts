import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    MovieWatchlistApiDeleteEntryRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist, MovieWatchlistEntry } from "../models";
import { MovieWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: MovieWatchlist;
    previousEntry?: MovieWatchlistEntry;
};

export const useDeleteMovieWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { movieWatchlist } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        MovieWatchlistApiDeleteEntryRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => movieWatchlist!.deleteEntry(params),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieWatchlistKeys.base,
            }),
        onMutate: ({ movieId }) => {
            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData<MovieWatchlist>(
                MovieWatchlistKeys.base,
            );

            const previousEntry = queryClient.getQueryData<MovieWatchlistEntry>(
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

            queryClient.setQueryData<MovieWatchlistEntry>(
                MovieWatchlistKeys.entry(params.movieId),
                context.previousEntry,
            );
        },
    });
};
