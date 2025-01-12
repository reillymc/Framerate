import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type {
    BuildSaveRequest,
    MovieCollectionApiCreateRequest,
    MovieCollectionApiUpdateRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollections?: MovieCollection[];
    previousCollection?: MovieCollection;
};

type MovieCollectionSaveRequest = BuildSaveRequest<
    MovieCollectionApiCreateRequest,
    MovieCollectionApiUpdateRequest,
    never,
    "collectionId",
    "newMovieCollection",
    "updatedCollection"
>;

export const useSaveMovieCollection = () => {
    const queryClient = useQueryClient();
    const { movieCollections } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        MovieCollection | null,
        unknown,
        MovieCollectionSaveRequest,
        Context
    >({
        mutationFn: ({ collectionId, ...collection }) =>
            collectionId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  movieCollections!.update({
                      collectionId,
                      updatedCollection: collection,
                  })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  movieCollections!.create({ newMovieCollection: collection }),
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
                                  return {
                                      collectionId: "",
                                      userId,
                                      ...params,
                                  };
                              }
                              return collection;
                          })
                        : [{ collectionId: "", userId, ...params }],
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
