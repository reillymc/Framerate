import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    ShowCollectionApiDeleteRequest,
} from "@/services";

import type { ShowCollection } from "../models";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollections?: ShowCollection[];
};

export const useDeleteShowCollection = () => {
    const queryClient = useQueryClient();
    const { showCollections } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        ShowCollectionApiDeleteRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => showCollections!._delete(params),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowCollectionKeys.base,
            }),
        onMutate: ({ collectionId }) => {
            // Snapshot the previous value
            const previousCollections = queryClient.getQueryData<
                ShowCollection[]
            >(ShowCollectionKeys.base);

            // Optimistically update to the new value
            queryClient.setQueryData<ShowCollection[]>(
                ShowCollectionKeys.base,
                previousCollections?.filter(
                    (collection) => collection.collectionId !== collectionId,
                ),
            );

            // Return snapshot so we can rollback in case of failure
            return { previousCollections };
        },
        onError: (error, _, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<ShowCollection[]>(
                ShowCollectionKeys.base,
                context.previousCollections,
            );
        },
    });
};
