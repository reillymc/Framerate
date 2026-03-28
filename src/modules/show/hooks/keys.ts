const baseKey = "shows";
export const ShowKeys = {
    details: (showId: number | undefined) => [baseKey, "details", showId],
    popular: () => [baseKey, "popular"],
    search: (query: string) => [baseKey, "search", query],
};
