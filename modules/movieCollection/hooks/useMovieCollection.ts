import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import { MovieCollectionKeys } from "./keys";

export const useMovieCollection = (collectionId: string | undefined) => {
    const queryClient = useQueryClient();
    const { movieCollections } = useFramerateServices();

    return useQuery({
        queryKey: MovieCollectionKeys.collection(collectionId),
        enabled: !!movieCollections,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            movieCollections!.find({ collectionId: collectionId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<MovieCollection[]>(MovieCollectionKeys.base)
                ?.find((d) => d.collectionId === collectionId),
    });
};
