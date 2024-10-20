const baseKey = "movieEntries";
export const MovieEntryKeys = {
    mutate: [baseKey],
    listEntries: (watchlistId: string | undefined) => [
        baseKey,
        "listEntries",
        watchlistId,
    ],
    listEntry: (
        watchlistId: string | undefined,
        movieId: number | undefined,
    ) => [baseKey, "listEntry", watchlistId, movieId],
};
