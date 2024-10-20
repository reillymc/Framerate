const baseKey = "showEntries";
export const ShowEntryKeys = {
    mutate: [baseKey],
    listEntries: (watchlistId: string | undefined) => [
        baseKey,
        "listEntries",
        watchlistId,
    ],
    listEntry: (
        watchlistId: string | undefined,
        showId: number | undefined,
    ) => [baseKey, "listEntry", watchlistId, showId],
};
