import { useSession } from "@/modules/auth";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type MovieEntry, watchlistId } from "../models";
import { MovieEntriesService, type SaveMovieEntryRequest } from "../services";
import { MovieEntryKeys } from "./keys";

type Context = { previousEntries?: MovieEntry[]; previousEntry?: MovieEntry };

export const useSaveMovieEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        MovieEntry | null,
        unknown,
        Omit<SaveMovieEntryRequest, "watchlistId">,
        Context
    >({
        mutationKey: MovieEntryKeys.mutate,
        mutationFn: (params) =>
            MovieEntriesService.saveMovieEntry({
                session,
                watchlistId,
                ...params,
            }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieEntryKeys.listEntries(watchlistId),
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries =
                queryClient.getQueryData<MovieEntry[]>(
                    MovieEntryKeys.listEntries(watchlistId),
                ) ?? [];

            const previousEntry = queryClient.getQueryData<MovieEntry>(
                MovieEntryKeys.listEntry(watchlistId, params.movieId),
            );

            const movieDetails = queryClient.getQueryData<Movie>(
                MovieKeys.details(params.movieId),
            );

            const movieDetailsPopular = queryClient
                .getQueryData<Movie[]>(MovieKeys.popular())
                ?.find(({ id }) => id === params.movieId);

            const updatedEntry = {
                ...movieDetailsPopular,
                ...movieDetails,
                ...params,
                title: movieDetails?.title ?? movieDetailsPopular?.title ?? "",
                releaseDate:
                    movieDetails?.releaseDate ??
                    movieDetailsPopular?.releaseDate,
                posterPath:
                    movieDetails?.posterPath ?? movieDetailsPopular?.posterPath,
            } satisfies MovieEntry;

            // Optimistically update to the new value
            queryClient.setQueryData<MovieEntry[]>(
                MovieEntryKeys.listEntries(watchlistId),
                [updatedEntry, ...previousEntries].sort((a, b) =>
                    a.releaseDate && b.releaseDate
                        ? new Date(b.releaseDate).getTime() -
                          new Date(a.releaseDate).getTime()
                        : -1,
                ),
            );

            queryClient.setQueryData<MovieEntry>(
                MovieEntryKeys.listEntry(watchlistId, params.movieId),
                updatedEntry,
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
