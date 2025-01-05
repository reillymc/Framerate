import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import {
    type DeleteShowCollectionEntryRequest,
    type DeleteShowCollectionEntryResponse,
    ShowCollectionService,
} from "../services";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollection?: ShowCollection;
    previousShowCollections?: string[];
};

export const useDeleteShowCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteShowCollectionEntryResponse | null,
        unknown,
        DeleteShowCollectionEntryRequest,
        Context
    >({
        mutationFn: (params) =>
            ShowCollectionService.deleteShowCollectionEntry({
                session,
                ...params,
            }),
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
