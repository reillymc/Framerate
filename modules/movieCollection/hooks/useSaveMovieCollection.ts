import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import {
    MovieCollectionService,
    type SaveMovieCollectionRequest,
} from "../services";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollections?: MovieCollection[];
    previousCollection?: MovieCollection;
};

export const useSaveMovieCollection = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        MovieCollection | null,
        unknown,
        SaveMovieCollectionRequest,
        Context
    >({
        mutationFn: (params) =>
            MovieCollectionService.saveMovieCollection({ session, ...params }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieCollectionKeys.base,
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousCollections = queryClient.getQueryData<
                MovieCollection[]
            >(MovieCollectionKeys.base);

            const previousCollection =
                queryClient.getQueryData<MovieCollection>(
                    MovieCollectionKeys.collection(params.collectionId),
                );

            // Optimistically update to the new value
            if (previousCollection) {
                queryClient.setQueryData<MovieCollection>(
                    MovieCollectionKeys.collection(params.collectionId),
                    { ...previousCollection, ...params },
                );

                queryClient.setQueryData<MovieCollection[]>(
                    MovieCollectionKeys.base,
                    previousCollections
                        ? previousCollections.map((collection) => {
                              if (
                                  collection.collectionId ===
                                  params.collectionId
                              ) {
                                  return { ...previousCollection, ...params };
                              }
                              return collection;
                          })
                        : [{ ...previousCollection, ...params }],
                );
            } else {
                queryClient.setQueryData<MovieCollection[]>(
                    MovieCollectionKeys.base,
                    previousCollections
                        ? previousCollections.map((collection) => {
                              if (
                                  collection.collectionId ===
                                  params.collectionId
                              ) {
                                  return { collectionId: "", ...params };
                              }
                              return collection;
                          })
                        : [{ collectionId: "", ...params }],
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousCollections, previousCollection };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<MovieCollection[]>(
                MovieCollectionKeys.base,
                context.previousCollections,
            );

            queryClient.setQueryData<MovieCollection>(
                MovieCollectionKeys.collection(params.collectionId),
                context.previousCollection,
            );
        },
    });
};
