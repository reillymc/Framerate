import { useFramerateServices } from "@/hooks";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieWatchlistApiCreateEntryRequest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist, MovieWatchlistEntry } from "../models";
import { MovieWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: MovieWatchlist;
    previousEntry?: MovieWatchlistEntry;
};

type MovieWatchlistEntrySaveRequest =
    MovieWatchlistApiCreateEntryRequest["saveMovieWatchlistEntryRequest"];

export const useSaveMovieWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { movieWatchlist } = useFramerateServices();

    return useMutation<
        MovieWatchlistEntry | null,
        unknown,
        MovieWatchlistEntrySaveRequest,
        Context
    >({
        mutationFn: (saveMovieWatchlistEntryRequest) =>
            // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
            movieWatchlist!.createEntry({ saveMovieWatchlistEntryRequest }),
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

            let movieDetails = queryClient.getQueryData<Movie>(
                MovieKeys.details(movieId),
            );

            if (!movieDetails) {
                movieDetails = queryClient
                    .getQueryData<Movie[]>(MovieKeys.popular())
                    ?.find(({ id }) => id === movieId);
            }

            const newEntry = {
                ...movieDetails,
                movieId,
                updatedAt: new Date().toISOString(),
                title: movieDetails?.title ?? "Loading...",
            } satisfies MovieWatchlistEntry;

            // Optimistically update to the new value
            if (previousWatchlist) {
                queryClient.setQueryData<MovieWatchlist>(
                    MovieWatchlistKeys.base,
                    {
                        ...previousWatchlist,
                        entries: [
                            ...(previousWatchlist.entries ?? []),
                            newEntry,
                        ],
                    },
                );
            }

            queryClient.setQueryData<MovieWatchlistEntry>(
                MovieWatchlistKeys.entry(movieId),
                newEntry,
            );

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
