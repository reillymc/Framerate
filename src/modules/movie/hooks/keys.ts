const baseKey = "movies";
export const MovieKeys = {
    details: (movieId: number | undefined) => [baseKey, "details", movieId],
    popular: () => [baseKey, "popular"],
    search: (query: string) => [baseKey, "search", query],
};
