const baseKey = "watchlistEntries";
export const WatchlistEntryKeys = {
    mutate: [baseKey],
    listEntries: (mediaType: string | undefined) => [baseKey, mediaType],
    listEntry: (mediaType: string | undefined, mediaId: number | undefined) => [
        baseKey,
        mediaType,
        mediaId,
    ],
};
