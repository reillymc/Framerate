import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    MovieCollectionApiDeleteRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollections?: MovieCollection[];
};

export const useDeleteMovieCollection = () => {
    const queryClient = useQueryClient();
    const { movieCollections } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        MovieCollectionApiDeleteRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => movieCollections!._delete(params),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: MovieCollectionKeys.base,
            }),
        onMutate: ({ collectionId }) => {
            // Snapshot the previous value
            const previousCollections = queryClient.getQueryData<
                MovieCollection[]
            >(MovieCollectionKeys.base);

            // Optimistically update to the new value
            queryClient.setQueryData<MovieCollection[]>(
                MovieCollectionKeys.base,
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

            queryClient.setQueryData<MovieCollection[]>(
                MovieCollectionKeys.base,
                context.previousCollections,
            );
        },
    });
};
