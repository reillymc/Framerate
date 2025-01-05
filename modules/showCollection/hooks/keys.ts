const baseKey = "showCollections";
export const ShowCollectionKeys = {
    base: [baseKey],
    collection: (collectionId: string | undefined) => [
        baseKey,
        "collection",
        collectionId,
    ],
    byShow: (showId: number | undefined) => [baseKey, "show", showId],
};
