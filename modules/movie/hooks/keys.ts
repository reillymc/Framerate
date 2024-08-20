const baseKey = "movies";
export const MovieKeys = {
    details: (movieId: number | undefined) => [baseKey, "details", movieId],
};
