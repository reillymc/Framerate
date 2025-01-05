import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import {
    type DeleteShowCollectionRequest,
    type DeleteShowCollectionResponse,
    ShowCollectionService,
} from "../services";
import { ShowCollectionKeys } from "./keys";

type Context = {
    previousCollections?: ShowCollection[];
};

export const useDeleteShowCollection = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteShowCollectionResponse | null,
        unknown,
        DeleteShowCollectionRequest,
        Context
    >({
        mutationFn: (params) =>
            ShowCollectionService.deleteShowCollection({ session, ...params }),
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
