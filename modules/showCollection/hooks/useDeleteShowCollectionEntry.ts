import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    ShowCollectionApiDeleteEntryRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollection?: ShowCollection;
    previousShowCollections?: string[];
};

export const useDeleteShowCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { showCollections } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        ShowCollectionApiDeleteEntryRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => showCollections!.deleteEntry(params),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowCollectionKeys.base,
            }),
        onMutate: ({ collectionId, showId }) => {
            // Snapshot the previous value
            const previousCollection = queryClient.getQueryData<ShowCollection>(
                ShowCollectionKeys.collection(collectionId),
            );

            const previousShowCollections = queryClient.getQueryData<string[]>(
                ShowCollectionKeys.byShow(showId),
            );

            // Optimistically delete the entry
            if (previousCollection?.entries) {
                queryClient.setQueryData<ShowCollection>(
                    ShowCollectionKeys.collection(collectionId),
                    {
                        ...previousCollection,
                        entries: previousCollection.entries.filter(
                            (show) => show.showId !== showId,
                        ),
                    },
                );
            }

            if (previousShowCollections) {
                queryClient.setQueryData<string[]>(
                    ShowCollectionKeys.byShow(showId),
                    previousShowCollections.filter(
                        (collection) => collection !== collectionId,
                    ),
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousCollection, previousShowCollections };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<ShowCollection>(
                ShowCollectionKeys.collection(params.collectionId),
                context.previousCollection,
            );

            queryClient.setQueryData<string[]>(
                ShowCollectionKeys.byShow(params.showId),
                context.previousShowCollections,
            );
        },
    });
};
