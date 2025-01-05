const baseKey = "showWatchlist";
export const ShowWatchlistKeys = {
    base: [baseKey],
    entry: (showId: number | undefined) => [baseKey, showId],
};
