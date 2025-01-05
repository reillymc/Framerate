import { useMemo } from "react";
import { useCollectionsForMovie } from "./useCollectionsForMovie";
import { useMovieCollections } from "./useMovieCollections";

export const useFilteredMovieCollections = (movieId: number | undefined) => {
    const { data: collections } = useMovieCollections();
    const { data: movieCollections } = useCollectionsForMovie(movieId);

    const collectionsContainingMovie = useMemo(
        () =>
            collections?.filter((item) =>
                movieCollections?.some(
                    (collectionId) => collectionId === item.collectionId,
                ),
            ),
        [collections, movieCollections],
    );

    const collectionsNotContainingMovie = useMemo(
        () =>
            collections?.filter(
                (item) =>
                    !movieCollections?.some(
                        (collectionId) => collectionId === item.collectionId,
                    ),
            ),
        [collections, movieCollections],
    );

    return { collectionsContainingMovie, collectionsNotContainingMovie };
};
