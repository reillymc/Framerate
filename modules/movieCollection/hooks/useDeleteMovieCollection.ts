import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import {
    type DeleteMovieCollectionRequest,
    type DeleteMovieCollectionResponse,
    MovieCollectionService,
} from "../services";
import { MovieCollectionKeys } from "./keys";

type Context = {
    previousCollections?: MovieCollection[];
};

export const useDeleteMovieCollection = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteMovieCollectionResponse | null,
        unknown,
        DeleteMovieCollectionRequest,
        Context
    >({
        mutationFn: (params) =>
            MovieCollectionService.deleteMovieCollection({
                session,
                ...params,
            }),
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
