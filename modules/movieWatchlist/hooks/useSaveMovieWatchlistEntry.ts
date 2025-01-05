import { useSession } from "@/modules/auth";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieEntry } from "@/modules/movieCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist } from "../models";
import { MovieWatchlistService, type SaveEntryRequest } from "../services";
import { MovieWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: MovieWatchlist;
    previousEntry?: MovieEntry;
};

export const useSaveMovieWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<MovieEntry | null, unknown, SaveEntryRequest, Context>({
        mutationFn: (params) =>
            MovieWatchlistService.saveEntry({ session, ...params }),
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
                title: movieDetails?.title ?? "Loading...",
            } satisfies MovieEntry;

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

            queryClient.setQueryData<MovieEntry>(
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

            queryClient.setQueryData<MovieEntry>(
                MovieWatchlistKeys.entry(params.movieId),
                context.previousEntry,
            );
        },
    });
};
