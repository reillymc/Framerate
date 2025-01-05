import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import {
    type SaveShowCollectionRequest,
    ShowCollectionService,
} from "../services";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollections?: ShowCollection[];
    previousCollection?: ShowCollection;
};

export const useSaveShowCollection = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        ShowCollection | null,
        unknown,
        SaveShowCollectionRequest,
        Context
    >({
        mutationFn: (params) =>
            ShowCollectionService.saveShowCollection({ session, ...params }),
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
