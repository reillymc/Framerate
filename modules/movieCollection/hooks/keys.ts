const baseKey = "movieCollections";
export const MovieCollectionKeys = {
    base: [baseKey],
    collection: (collectionId: string | undefined) => [
        baseKey,
        "collection",
        collectionId,
    ],
    byMovie: (movieId: number | undefined) => [baseKey, "movie", movieId],
};
