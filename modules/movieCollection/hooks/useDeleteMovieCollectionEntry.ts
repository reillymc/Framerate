import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    MovieCollectionApiDeleteEntryRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollection?: MovieCollection;
    previousMovieCollections?: string[];
};

export const useDeleteMovieCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { movieCollections } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        MovieCollectionApiDeleteEntryRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => movieCollections!.deleteEntry(params),
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

            // Optimistically delete the entry
            if (previousCollection?.entries) {
                queryClient.setQueryData<MovieCollection>(
                    MovieCollectionKeys.collection(collectionId),
                    {
                        ...previousCollection,
                        entries: previousCollection.entries.filter(
                            (movie) => movie.movieId !== movieId,
                        ),
                    },
                );
            }

            if (previousMovieCollections) {
                queryClient.setQueryData<string[]>(
                    MovieCollectionKeys.byMovie(movieId),
                    previousMovieCollections.filter(
                        (collection) => collection !== collectionId,
                    ),
                );
            }

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
