import type { Show } from "@/modules/show";

export type ShowEntry = {
    showId: Show["id"];
    name: Show["name"];
    updatedAt?: string;
    imdbId?: string;
    status?: Show["status"];
    posterPath?: Show["posterPath"];
    firstAirDate?: Show["firstAirDate"];
    lastAirDate?: Show["lastAirDate"];
    nextAirDate?: Show["nextAirDate"];
};

export type ShowCollection = {
    collectionId: string;
    name: string;
    entries?: Array<ShowEntry>;
};
