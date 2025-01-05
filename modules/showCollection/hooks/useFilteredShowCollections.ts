import { useMemo } from "react";
import { useCollectionsForShow } from "./useCollectionsForShow";
import { useShowCollections } from "./useShowCollections";

export const useFilteredShowCollections = (showId: number | undefined) => {
    const { data: collections } = useShowCollections();
    const { data: showCollections } = useCollectionsForShow(showId);

    const collectionsContainingShow = useMemo(
        () =>
            collections?.filter((item) =>
                showCollections?.some(
                    (collectionId) => collectionId === item.collectionId,
                ),
            ),
        [collections, showCollections],
    );

    const collectionsNotContainingShow = useMemo(
        () =>
            collections?.filter(
                (item) =>
                    !showCollections?.some(
                        (collectionId) => collectionId === item.collectionId,
                    ),
            ),
        [collections, showCollections],
    );

    return { collectionsContainingShow, collectionsNotContainingShow };
};
