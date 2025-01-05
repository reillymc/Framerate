import { useSession } from "@/modules/auth";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection, MovieEntry } from "../models";
import {
    MovieCollectionService,
    type SaveMovieCollectionEntryRequest,
} from "../services";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollection?: MovieCollection;
    previousMovieCollections?: string[];
};

export const useSaveMovieCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        MovieEntry | null,
        unknown,
        SaveMovieCollectionEntryRequest,
        Context
    >({
        mutationFn: (params) =>
            MovieCollectionService.saveMovieCollectionEntry({
                session,
                ...params,
            }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieCollectionKeys.base,
            }),
        onMutate: ({ collectionId, movieId }) => {
            // Snapshot the previous value
            const previousCollection =
                queryClient.getQueryData<MovieCollection>(
                    MovieCollectionKeys.collection(collectionId),
                );

            const previousMovieCollections = queryClient.getQueryData<string[]>(
                MovieCollectionKeys.byMovie(movieId),
            );

            let movieDetails = queryClient.getQueryData<Movie>(
                MovieKeys.details(movieId),
            );

            if (!movieDetails) {
                movieDetails = queryClient
                    .getQueryData<Movie[]>(MovieKeys.popular())
                    ?.find(({ id }) => id === movieId);
            }

            const newEntry: MovieEntry = {
                ...movieDetails,
                movieId,
                title: movieDetails?.title ?? "Loading...",
            };

            // Optimistically update to the new value
            if (previousCollection) {
                queryClient.setQueryData<MovieCollection>(
                    MovieCollectionKeys.collection(collectionId),
                    {
                        ...previousCollection,
                        entries: [
                            ...(previousCollection.entries ?? []),
                            newEntry,
                        ],
                    },
                );
            }

            queryClient.setQueryData<string[]>(
                MovieCollectionKeys.byMovie(movieId),
                [...(previousMovieCollections ?? []), collectionId],
            );

            // Return snapshot so we can rollback in case of failure
            return { previousCollection, previousMovieCollections };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<MovieCollection>(
                MovieCollectionKeys.collection(params.collectionId),
                context.previousCollection,
            );

            queryClient.setQueryData<string[]>(
                MovieCollectionKeys.byMovie(params.movieId),
                context.previousMovieCollections,
            );
        },
    });
};
