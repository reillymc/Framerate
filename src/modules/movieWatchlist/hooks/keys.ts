const baseKey = "movieWatchlist";
export const MovieWatchlistKeys = {
    base: [baseKey],
    entry: (movieId: number | undefined) => [baseKey, movieId],
};
