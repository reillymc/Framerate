import { useQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import { MovieCollectionKeys } from "./keys";

export const useCollectionsForMovie = (movieId: number | undefined) => {
    const { movieCollections } = useFramerateServices();

    return useQuery({
        queryKey: MovieCollectionKeys.byMovie(movieId),
        enabled: !!movieCollections,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            movieCollections!.findByMovie({ movieId: movieId! }, { signal }),
    });
};
