import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieCollection } from "../models";
import { MovieCollectionService } from "../services";
import { MovieCollectionKeys } from "./keys";

export const useMovieCollection = (collectionId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: MovieCollectionKeys.collection(collectionId),
        queryFn: () =>
            MovieCollectionService.getMovieCollection({
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                collectionId: collectionId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<MovieCollection[]>(MovieCollectionKeys.base)
                ?.find((d) => d.collectionId === collectionId),
    });
};
