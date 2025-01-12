import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieCollectionApiCreateEntryRequest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection, MovieEntry } from "../models";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollection?: MovieCollection;
    previousMovieCollections?: string[];
};

type MovieCollectionEntrySaveRequest = Pick<
    MovieCollectionApiCreateEntryRequest,
    "collectionId"
> &
    MovieCollectionApiCreateEntryRequest["saveMovieCollectionEntryRequest"];

export const useSaveMovieCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { movieCollections } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        MovieEntry | null,
        unknown,
        MovieCollectionEntrySaveRequest,
        Context
    >({
        mutationFn: (params) =>
            // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
            movieCollections!.createEntry({
                ...params,
                saveMovieCollectionEntryRequest: params,
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
                collectionId,
                movieId,
                userId,
                updatedAt: new Date(),
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
