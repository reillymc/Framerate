const baseKey = "seasons";
export const SeasonKeys = {
    details: (showId: number | undefined, seasonId: number | undefined) => [
        baseKey,
        "details",
        showId,
        seasonId,
    ],
};
