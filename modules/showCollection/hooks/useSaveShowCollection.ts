import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type {
    BuildSaveRequest,
    ShowCollectionApiCreateRequest,
    ShowCollectionApiUpdateRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollections?: ShowCollection[];
    previousCollection?: ShowCollection;
};

type ShowCollectionSaveRequest = BuildSaveRequest<
    ShowCollectionApiCreateRequest,
    ShowCollectionApiUpdateRequest,
    never,
    "collectionId",
    "newShowCollection",
    "updatedCollection"
>;

export const useSaveShowCollection = () => {
    const queryClient = useQueryClient();
    const { showCollections } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        ShowCollection | null,
        unknown,
        ShowCollectionSaveRequest,
        Context
    >({
        mutationFn: ({ collectionId, ...collection }) =>
            collectionId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  showCollections!.update({
                      collectionId,
                      updatedCollection: collection,
                  })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  showCollections!.create({ newShowCollection: collection }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowCollectionKeys.base,
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousCollections = queryClient.getQueryData<
                ShowCollection[]
            >(ShowCollectionKeys.base);

            const previousCollection = queryClient.getQueryData<ShowCollection>(
                ShowCollectionKeys.collection(params.collectionId),
            );

            // Optimistically update to the new value
            if (previousCollection) {
                queryClient.setQueryData<ShowCollection>(
                    ShowCollectionKeys.collection(params.collectionId),
                    { ...previousCollection, ...params },
                );

                queryClient.setQueryData<ShowCollection[]>(
                    ShowCollectionKeys.base,
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
                queryClient.setQueryData<ShowCollection[]>(
                    ShowCollectionKeys.base,
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

            queryClient.setQueryData<ShowCollection[]>(
                ShowCollectionKeys.base,
                context.previousCollections,
            );

            queryClient.setQueryData<ShowCollection>(
                ShowCollectionKeys.collection(params.collectionId),
                context.previousCollection,
            );
        },
    });
};
