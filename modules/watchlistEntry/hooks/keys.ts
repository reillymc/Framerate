const baseKey = "watchlistEntries";
export const WatchlistEntryKeys = {
    mutate: [baseKey],
    listEntries: (mediaType: string | undefined) => [
        baseKey,
        "listEntries",
        mediaType,
    ],
    listEntry: (mediaType: string | undefined, mediaId: number | undefined) => [
        baseKey,
        "listEntry",
        mediaType,
        mediaId,
    ],
};
