import { useSession } from "@/modules/auth";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection, ShowEntry } from "../models";
import {
    type SaveShowCollectionEntryRequest,
    ShowCollectionService,
} from "../services";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollection?: ShowCollection;
    previousShowCollections?: string[];
};

export const useSaveShowCollectionEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        ShowEntry | null,
        unknown,
        SaveShowCollectionEntryRequest,
        Context
    >({
        mutationFn: (params) =>
            ShowCollectionService.saveShowCollectionEntry({
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

            let showDetails = queryClient.getQueryData<Show>(
                ShowKeys.details(showId),
            );

            if (!showDetails) {
                showDetails = queryClient
                    .getQueryData<Show[]>(ShowKeys.popular())
                    ?.find(({ id }) => id === showId);
            }

            const newEntry: ShowEntry = {
                ...showDetails,
                showId,
                name: showDetails?.name ?? "Loading...",
            };

            // Optimistically update to the new value
            if (previousCollection) {
                queryClient.setQueryData<ShowCollection>(
                    ShowCollectionKeys.collection(collectionId),
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
                ShowCollectionKeys.byShow(showId),
                [...(previousShowCollections ?? []), collectionId],
            );

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
