import type { Show } from "@/modules/show";

export type ShowEntry = {
    showId: Show["id"];
    name: Show["name"];
    imdbId?: string;
    posterPath?: Show["posterPath"];
    firstAirDate?: Show["firstAirDate"];
    lastAirDate?: Show["lastAirDate"];
    nextAirDate?: Show["nextAirDate"];
};

// TODO: remove when multiple lists are supported
export const watchlistId = "default" as const;
